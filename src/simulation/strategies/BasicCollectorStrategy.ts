import type { RobotStrategy, Action } from "../Robot";
import { Robot } from "../Robot";
import { Field } from "../Field";
import { FieldTile, FIELD_WIDTH } from "../GameConst";
import {
  getBallEV,
  findNearestEmptyTile,
  getPathTarget,
  isInTeamZone,
} from "../StrategyUtils";

export class BasicCollectorStrategy implements RobotStrategy {
  moveSpeed = 24.0; // grid cells per second (10 ft/s = 120 in/s = 24 cells at 5in/cell)
  actionTime = 0.5; // Fast pickup
  isDelivering = false;
  lastDropLocation: { x: number; y: number } | null = null;

  decideMove(robot: Robot, field: Field): { x: number; y: number } | null {
    // Target the Goal directly for maximum efficiency
    const goal = field.scoringLocations.find((sl) => sl.team === robot.team);
    if (!goal) return null;

    const goalPos = { x: goal.tileX + 0.5, y: goal.tileY + 0.5 };
    const goalEV = getBallEV(goalPos.x, goalPos.y, robot.team, field);

    // State Machine logic
    if (robot.ballCount >= robot.maxBalls) {
      this.isDelivering = true;
    } else if (robot.ballCount === 0) {
      this.isDelivering = false;
    }

    // Mode 2: Delivery (if currently delivering or full)
    if (this.isDelivering && robot.ballCount > 0) {
      // Find the NEAREST empty tile to the scoring location
      // Radius 4 covers the area around the goal without searching the whole field
      const nearestEmpty = findNearestEmptyTile(
        field,
        { x: goal.tileX, y: goal.tileY },
        4,
        { x: goal.tileX, y: goal.tileY }, // Exclude the goal tile itself
      );
      if (nearestEmpty) {
        return getPathTarget(field, robot, nearestEmpty);
      }
    }

    // Mode 1: Collection - always prioritize closest balls
    if (!this.isDelivering && robot.ballCount < robot.maxBalls) {
      const closestBall = this.findClosestBall(field, robot);
      if (closestBall) {
        return getPathTarget(field, robot, closestBall);
      }
    }

    // If no balls to collect, try to intercept opponents heading to score
    const interceptTarget = this.findInterceptTarget(field, robot);
    if (interceptTarget) {
      return getPathTarget(field, robot, interceptTarget);
    }

    return null;
  }

  findClosestBall(field: Field, robot: Robot): { x: number; y: number } | null {
    let closestBall: { x: number; y: number } | null = null;
    let closestDist = Infinity;

    for (let r = 0; r < field.grid.length; r++) {
      for (let c = 0; c < field.grid[0].length; c++) {
        if (field.grid[r][c] === FieldTile.BALL) {
          const dist = Math.sqrt(Math.pow(c - robot.x, 2) + Math.pow(r - robot.y, 2));
          if (dist < closestDist) {
            closestDist = dist;
            closestBall = { x: c + 0.5, y: r + 0.5 };
          }
        }
      }
    }
    return closestBall;
  }

  findInterceptTarget(field: Field, robot: Robot): { x: number; y: number } | null {
    // Find opponent robots that have balls and are heading toward our zone
    const opponents = field.scoringLocations
      .filter(sl => sl.team !== robot.team)
      .map(sl => ({ x: sl.tileX, y: sl.tileY }));

    if (opponents.length === 0) return null;

    // Position between opponent goal and center to block
    const ourZoneX = robot.team === "RED" ? FIELD_WIDTH / 6 : (5 * FIELD_WIDTH) / 6;
    
    // Just move toward our zone boundary to defend
    if (!isInTeamZone(robot.x, robot.team)) {
      return { x: ourZoneX, y: robot.y };
    }

    return null;
  }

  decideAction(robot: Robot, field: Field): Action | null {
    const r = Math.floor(robot.y);
    const c = Math.floor(robot.x);

    const goal = field.scoringLocations.find((sl) => sl.team === robot.team);
    if (!goal) return null;

    const goalPos = { x: goal.tileX + 0.5, y: goal.tileY + 0.5 };

    // Always collect if on a ball and have capacity
    if (
      !this.isDelivering &&
      r >= 0 &&
      r < field.grid.length &&
      c >= 0 &&
      c < field.grid[0].length
    ) {
      if (
        field.grid[r][c] === FieldTile.BALL &&
        robot.ballCount < robot.maxBalls
      ) {
        return { type: "COLLECT" };
      }
    }

    // Drop if "close enough" to Goal and tile is empty
    if (robot.ballCount > 0 && this.isDelivering) {
      const dx = robot.x - goalPos.x;
      const dy = robot.y - goalPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const isGoal = goal.tileX === c && goal.tileY === r;

      // Drop if within range (4) of goal and on an empty tile
      if (dist <= 4 && field.grid[r][c] === FieldTile.EMPTY && !isGoal) {
        this.lastDropLocation = { x: c, y: r };
        return { type: "DROP" };
      }
    }

    return null;
  }
}
