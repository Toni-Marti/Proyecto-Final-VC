export enum Tool {
  NONE,
  PENCIL,
  SHAPES,
  LINES,
  ERASER,
  FILL_AND_STROKE,
}

export class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export interface FASContext {
  thickness: number;
  stroke_color: string;
  fill_color: string;
}
