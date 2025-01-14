import { describe, expect, it } from "vitest";
import { flipMatrixHorizontally, flipMatrixVertically, rotateMatrix90Clockwise, rotateMatrix90CounterClockwise } from "@/utils/matrix.ts";

describe("rotateMatrix90Clockwise", () => {
  it("rotate", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = rotateMatrix90Clockwise(matrix);

    expect(result).toStrictEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3]
    ]);
  });

  it("makes a copy", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = rotateMatrix90Clockwise(matrix);
    result[0] = [0, 0, 0];
    result[1][1] = 0;

    expect(matrix).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });
});

describe("rotateMatrix90CounterClockwise", () => {
  it("rotate", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = rotateMatrix90CounterClockwise(matrix);

    expect(result).toStrictEqual([
      [3, 6, 9],
      [2, 5, 8],
      [1, 4, 7]
    ]);
  });

  it("makes a copy", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = rotateMatrix90CounterClockwise(matrix);
    result[0] = [0, 0, 0];
    result[1][1] = 0;

    expect(matrix).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });
});

describe("flipMatrixVertically", () => {
  it("flip", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = flipMatrixVertically(matrix);

    expect(result).toStrictEqual([
      [7, 8, 9],
      [4, 5, 6],
      [1, 2, 3]
    ]);
  });

  it("makes a copy", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = flipMatrixVertically(matrix);
    result[0] = [0, 0, 0];
    result[1][1] = 0;

    expect(matrix).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });
});

describe("flipMatrixHorizontally", () => {
  it("flip", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = flipMatrixHorizontally(matrix);

    expect(result).toStrictEqual([
      [3, 2, 1],
      [6, 5, 4],
      [9, 8, 7]
    ]);
  });

  it("makes a copy", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];

    const result = flipMatrixHorizontally(matrix);
    result[0] = [0, 0, 0];
    result[1][1] = 0;

    expect(matrix).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });
});
