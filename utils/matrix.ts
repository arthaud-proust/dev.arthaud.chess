export function rotateMatrix90Clockwise<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotatedMatrix: T[][] = Array.from({ length: cols }, () =>
    Array<T>(rows),
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotatedMatrix[col][rows - row - 1] = matrix[row][col];
    }
  }

  return rotatedMatrix;
}

export function rotateMatrix90CounterClockwise<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotatedMatrix: T[][] = Array.from({ length: cols }, () =>
    Array<T>(rows),
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotatedMatrix[cols - col - 1][row] = matrix[row][col];
    }
  }

  return rotatedMatrix;
}

export function flipMatrixVertically<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  const rows = matrix.length;

  return Array.from({ length: rows }, (_, i) => [
    ...matrix[rows - i - 1],
  ]) as T[][];
}

export function flipMatrixHorizontally<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return matrix;
  }

  return matrix.map((row) => [...row].reverse()) as T[][];
}
