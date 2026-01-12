import type { RobotStrategy, Action } from "../Robot";
import { Robot } from "../Robot";
import { Field } from "../Field";
import { FieldTile, FIELD_WIDTH } from "../GameConst";
import {
  getScoringLocation,
  getPathTarget,
  isInTeamZone,
} from "../StrategyUtils";

export class BasicScoringStrategy implements RobotStrategy {
  moveSpeed = 24.0; // grid cells per second (10 ft/s = 120 in/s = 24 cells at 5in/cell)
  actionTime = 1.0;

  decideMove(robot: Robot, field: Field): { x: number; y: number } | null {
    // If has ball, check if in zone to score or need to move
    if (robot.ballCount > 0) {
      const inZone = isInTeamZone(robot.x, robot.team);
      const scoreLoc = getScoringLocation(field, robot.team);

      if (scoreLoc) {
        if (inZone) {
          // In zone: Go to Goal
          return getPathTarget(field, robot, {
            x: scoreLoc.x + 0.5,
            y: scoreLoc.y + 0.5,
          });
        } else {
          // Not in zone: Must move into zone
          // For Red: x < FIELD_WIDTH / 3. For Blue: x >= 2 * FIELD_WIDTH / 3.
          const safeZoneX =
            robot.team === "RED"
              ? FIELD_WIDTH / 3 - 1
              : (2 * FIELD_WIDTH) / 3 + 1;
          return getPathTarget(field, robot, { x: safeZoneX, y: robot.y }); // Move towards zone boundary
        }
      }
    }

    // Else, find closest ball to reload
    const closestBall = this.findClosestBall(field, robot);
    if (closestBall) {
      return getPathTarget(field, robot, closestBall);
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

  decideAction(robot: Robot, field: Field): Action | null {
    // Shoot if has ball and IN ZONE
    if (robot.ballCount > 0) {
      const targetLoc = field.scoringLocations.find(
        (sl) => sl.team === robot.team,
      );
      if (targetLoc) {
        const inZone = isInTeamZone(robot.x, robot.team);

        if (inZone) {
          // Standard Scoring Logic
          const dx = targetLoc.tileX + 0.5 - robot.x;
          const dy = targetLoc.tileY + 0.5 - robot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= robot.maxShootDistance) {
            const angle = Math.atan2(dy, dx);
            return { type: "SHOOT", distance: dist, angle: angle };
          }
        }
      }
    }

    // Collect if empty and at ball
    if (robot.ballCount < robot.maxBalls) {
      const r = Math.floor(robot.y);
      const c = Math.floor(robot.x);

      if (
        r >= 0 &&
        r < field.grid.length &&
        c >= 0 &&
        c < field.grid[0].length
      ) {
        if (field.grid[r][c] === FieldTile.BALL) {
          return { type: "COLLECT" };
        }
      }
    }
    return null;
  }
}
