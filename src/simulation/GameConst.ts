export const TICK_RATE = 20; // Ticks per second
export const GAME_DURATION = 1500; // Seconds

// Physical Dimensions (in inches)
export const GRID_SIZE_INCHES = 5; // Each grid cell is 5 inches
export const BALL_SIZE_INCHES = 5; // Each ball is 5 inches diameter
export const ROBOT_WIDTH_INCHES = 30; // Robot width in inches
export const ROBOT_HEIGHT_INCHES = 30; // Robot height in inches

// Derived sizes in grid units
export const BALL_RADIUS_GRID = (BALL_SIZE_INCHES / 2) / GRID_SIZE_INCHES; // Ball radius in grid units
export const ROBOT_WIDTH_GRID = ROBOT_WIDTH_INCHES / GRID_SIZE_INCHES; // Robot width in grid units (6 cells)
export const ROBOT_HEIGHT_GRID = ROBOT_HEIGHT_INCHES / GRID_SIZE_INCHES; // Robot height in grid units (6 cells)

// Field Dimensions and Layout
// Standard FRC field: 54ft x 27ft = 648in x 324in
// With 5-inch grid: 130 cells x 65 cells
// '#' = Obstacle, '.' = Empty, 'O' = Ball
const FRC_FIELD_WIDTH = 130;  // 54ft / 5in = 130 cells
const FRC_FIELD_HEIGHT = 65;  // 27ft / 5in = 65 cells (using 65 for odd number to have center row)

function generateFieldLayout(): string[] {
  const layout: string[] = [];
  const centerX = Math.floor(FRC_FIELD_WIDTH / 2);
  const centerY = Math.floor(FRC_FIELD_HEIGHT / 2);
  
  // Center balls: 10 columns x 40 rows
  const centerBallCols = 10;
  const centerBallRows = 40;
  const centerStartX = centerX - Math.floor(centerBallCols / 2);
  const centerStartY = centerY - Math.floor(centerBallRows / 2);
  
  // Side balls: 4 columns x 6 rows at ends of field (vertically centered)
  const sideBallCols = 4;
  const sideBallRows = 6;
  const sideStartY = centerY - Math.floor(sideBallRows / 2);
  const leftSideStartX = 2; // Near left edge
  const rightSideStartX = FRC_FIELD_WIDTH - sideBallCols - 2; // Near right edge
  
  // Corner balls: 4 columns x 6 rows in lower left and lower right corners
  const cornerBallCols = 4;
  const cornerBallRows = 6;
  const cornerStartY = FRC_FIELD_HEIGHT - cornerBallRows - 2; // Near bottom
  const lowerLeftStartX = 2;
  const lowerRightStartX = FRC_FIELD_WIDTH - cornerBallCols - 2;
  
  for (let y = 0; y < FRC_FIELD_HEIGHT; y++) {
    let row = '';
    for (let x = 0; x < FRC_FIELD_WIDTH; x++) {
      // Check center ball region
      const inCenterBalls = x >= centerStartX && x < centerStartX + centerBallCols &&
                            y >= centerStartY && y < centerStartY + centerBallRows;
      
      // Check left side ball region
      const inLeftSideBalls = x >= leftSideStartX && x < leftSideStartX + sideBallCols &&
                              y >= sideStartY && y < sideStartY + sideBallRows;
      
      // Check right side ball region
      const inRightSideBalls = x >= rightSideStartX && x < rightSideStartX + sideBallCols &&
                               y >= sideStartY && y < sideStartY + sideBallRows;
      
      // Check lower left corner ball region
      const inLowerLeftCorner = x >= lowerLeftStartX && x < lowerLeftStartX + cornerBallCols &&
                                y >= cornerStartY && y < cornerStartY + cornerBallRows;
      
      // Check lower right corner ball region
      const inLowerRightCorner = x >= lowerRightStartX && x < lowerRightStartX + cornerBallCols &&
                                 y >= cornerStartY && y < cornerStartY + cornerBallRows;
      
      if (inCenterBalls || inLeftSideBalls || inRightSideBalls || inLowerLeftCorner || inLowerRightCorner) {
        row += 'O';
      } else {
        row += '.';
      }
    }
    layout.push(row);
  }
  return layout;
}

export const INITIAL_FIELD_LAYOUT = generateFieldLayout();

export const FIELD_WIDTH = INITIAL_FIELD_LAYOUT[0].length;
export const FIELD_HEIGHT = INITIAL_FIELD_LAYOUT.length;

export const TEAM_RED = "RED";
export const TEAM_BLUE = "BLUE";
export type Team = typeof TEAM_RED | typeof TEAM_BLUE;

export const SCORING_INTERVAL = 300; // Ticks before switching scoring/collecting focus
export const BALL_SPEED = 15; // Meters per second
export const ROBOTS_PER_TEAM = 3;
export const SHOT_COOLDOWN_TICKS = 10; // 0.5 seconds between shots (2 shots per second at 20 ticks/sec)

export const FieldTile = {
  EMPTY: 0,
  WALL: 1,
  BALL: 2,
  GOAL: 3,
} as const;
export type FieldTile = (typeof FieldTile)[keyof typeof FieldTile];

// EV Constants
export const EV_OWN_ZONE = 0.9;
export const EV_NEUTRAL_ZONE = 0.3;
export const EV_OPPONENT_ZONE = -0.2;
export const EV_SCORED = 1.0;
export const DIST_EV_COST = 0.01;
