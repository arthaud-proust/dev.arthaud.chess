export const NONE = 0;
export const WHITE = 1;
export const BLACK = 2;
export const Colors = Object.freeze({
  NONE,
  WHITE,
  BLACK
});
export type Color = typeof Colors[keyof typeof Colors];

export const __ = 0;
export const WK = 4; // White King
export const WQ = 5; // White Queen
export const WB = 6; // White Bishop
export const WR = 7; // White Rock
export const WN = 8; // White Knight
export const WP = 9; // White Pawn
export const BK = 10; // Black King
export const BQ = 11; // Black Queen
export const BB = 12; // Black Bishop
export const BR = 13; // Black Rook
export const BN = 14; // Black Knight
export const BP = 15; // Black Pawn
export const Pieces = Object.freeze({
  __,
  WK,
  WQ,
  WB,
  WR,
  WN,
  WP,
  BK,
  BQ,
  BB,
  BR,
  BN,
  BP
});
export type Piece = typeof Pieces[keyof typeof Pieces]

export const TOP_LEFT = 1;
export const TOP = 2;
export const TOP_RIGHT = 3;
export const RIGHT = 4;
export const BOTTOM_RIGHT = 5;
export const BOTTOM = 6;
export const BOTTOM_LEFT = 7;
export const LEFT = 8;
export const Directions = Object.freeze({
  TOP_LEFT: 1,
  TOP: 2,
  TOP_RIGHT: 3,
  RIGHT: 4,
  BOTTOM_RIGHT: 5,
  BOTTOM: 6,
  BOTTOM_LEFT: 7,
  LEFT: 8
});
export type Direction = typeof Directions[keyof typeof Directions]

export type Position = {
  col: number;
  row: number;
};

export type Move = {
  origin: Position;
  destination: Position;
};

export type GameBoard = [
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
  [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece],
];

export type GameSnapshot = {
  board: GameBoard;
  currentPlayer: Color;
  hasWhiteLostCastling: boolean;
  hasBlackLostCastling: boolean;
  lastMove: Move;
};

export type CastlingPositions = {
  kingOrigin: Position;
  kingDestination: Position;
  rookOrigin: Position;
  rookDestination: Position;
};

export const ROWS = 8;
export const COLS = 8;

export const ASCII_LOWER_A = 97;
export const ASCII_ONE = 49;

export const WHITE_PAWN_ROW_PROMOTION = 7;
export const BLACK_PAWN_ROW_PROMOTION = 0;

export const WHITE_PAWN_START_ROW = 1;
export const WHITE_PAWN_START_JUMP_ROW = 3;
export const BLACK_PAWN_START_ROW = 6;
export const BLACK_PAWN_START_JUMP_ROW = 4;

export const WHITE_CASTLING_KING_SIDE: CastlingPositions = {
  kingOrigin: { col: 4, row: 0 },
  kingDestination: { col: 6, row: 0 },
  rookOrigin: { col: 7, row: 0 },
  rookDestination: { col: 5, row: 0 }
};

export const WHITE_CASTLING_QUEEN_SIDE: CastlingPositions = {
  kingOrigin: { col: 4, row: 0 },
  kingDestination: { col: 2, row: 0 },
  rookOrigin: { col: 0, row: 0 },
  rookDestination: { col: 3, row: 0 }
};

export const BLACK_CASTLING_KING_SIDE: CastlingPositions = {
  kingOrigin: { col: 4, row: 7 },
  kingDestination: { col: 6, row: 7 },
  rookOrigin: { col: 7, row: 7 },
  rookDestination: { col: 5, row: 7 }
};

export const BLACK_CASTLING_QUEEN_SIDE: CastlingPositions = {
  kingOrigin: { col: 4, row: 7 },
  kingDestination: { col: 2, row: 7 },
  rookOrigin: { col: 0, row: 7 },
  rookDestination: { col: 3, row: 7 }
};

export function areSamePositions(a: Position, b: Position): boolean {
  return a.col == b.col && a.row == b.row;
}

export function withSameRow(position: Position, col: number): Position {
  return {
    col,
    row: position.row
  };
}

export function withSameCol(position: Position, row: number): Position {
  return {
    col: position.col,
    row
  };
}

function atDirection(position: Position, direction: Direction, distance: number): Position {
  const newPosition: Position = {
    col: position.col,
    row: position.row
  };

  if (
    direction == TOP_LEFT
    || direction == TOP
    || direction == TOP_RIGHT
  ) {
    newPosition.row += distance;
  }

  if (
    direction == BOTTOM_LEFT
    || direction == BOTTOM
    || direction == BOTTOM_RIGHT
  ) {
    newPosition.row -= distance;
  }

  if (
    direction == BOTTOM_RIGHT
    || direction == RIGHT
    || direction == TOP_RIGHT
  ) {
    newPosition.col += distance;
  }

  if (
    direction == BOTTOM_LEFT
    || direction == LEFT
    || direction == TOP_LEFT
  ) {
    newPosition.col -= distance;
  }

  return newPosition;
}

function rowsBetween(a: Position, b: Position): number {
  return Math.abs(a.row - b.row);
}

function colsBetween(a: Position, b: Position): number {
  return Math.abs(a.col - b.col);
}

export function pieceColor(piece: Piece): Color {
  switch (piece) {
    case WK:
    case WQ:
    case WB:
    case WR:
    case WN:
    case WP:
      return WHITE;
    case BK:
    case BQ:
    case BB:
    case BR:
    case BN:
    case BP:
      return BLACK;
    case __:
      return NONE;
  }
}

function moveTo(board: GameBoard, origin: Position, destination: Position): void {
  board[destination.col][destination.row] = board[origin.col][origin.row];
  board[origin.col][origin.row] = __;
}

function pieceAtColRow(board: GameBoard, col: number, row: number): Piece {
  return board[col][row];
}

export function pieceAt(board: GameBoard, position: Position): Piece {
  return pieceAtColRow(board, position.col, position.row);
}

export function copyOfGameSnapshot(gameSnapshot: GameSnapshot): GameSnapshot {
  const newGameSnapshot: GameSnapshot = createGameSnapshot();

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      newGameSnapshot.board[col][row] = gameSnapshot.board[col][row];
    }
  }

  newGameSnapshot.currentPlayer = gameSnapshot.currentPlayer;
  newGameSnapshot.hasWhiteLostCastling = gameSnapshot.hasWhiteLostCastling;
  newGameSnapshot.hasBlackLostCastling = gameSnapshot.hasBlackLostCastling;

  newGameSnapshot.lastMove.origin = {
    row: gameSnapshot.lastMove.origin.row,
    col: gameSnapshot.lastMove.origin.col
  };
  newGameSnapshot.lastMove.destination = {
    row: gameSnapshot.lastMove.destination.row,
    col: gameSnapshot.lastMove.destination.col
  };

  return newGameSnapshot;
}

function appliedMove(gameSnapshot: GameSnapshot, origin: Position, destination: Position): GameSnapshot {
  const nextGameSnapshot: GameSnapshot = copyOfGameSnapshot(gameSnapshot);

  const pieceMoved: Piece = pieceAt(gameSnapshot.board, origin);
  const pieceAtDestination: Piece = pieceAt(gameSnapshot.board, destination);

  moveTo(nextGameSnapshot.board, origin, destination);

  if (
    pieceMoved == WP
    && !pieceAtDestination
    && origin.row == BLACK_PAWN_START_JUMP_ROW
    && (
      areSamePositions(destination, atDirection(origin, TOP_LEFT, 1))
      || areSamePositions(destination, atDirection(origin, TOP_RIGHT, 1))
    )
    && pieceAt(gameSnapshot.board, gameSnapshot.lastMove.destination) == BP
    && gameSnapshot.lastMove.origin.row == BLACK_PAWN_START_ROW
    && gameSnapshot.lastMove.destination.row == BLACK_PAWN_START_JUMP_ROW
    && destination.col == gameSnapshot.lastMove.destination.col
  ) {
    nextGameSnapshot.board[gameSnapshot.lastMove.destination.col][gameSnapshot.lastMove.destination.row] = __;
  }

  if (
    pieceMoved == BP
    && !pieceAtDestination
    && origin.row == WHITE_PAWN_START_JUMP_ROW
    && (
      areSamePositions(destination, atDirection(origin, BOTTOM_LEFT, 1))
      || areSamePositions(destination, atDirection(origin, BOTTOM_RIGHT, 1))
    )
    && pieceAt(gameSnapshot.board, gameSnapshot.lastMove.destination) == WP
    && gameSnapshot.lastMove.origin.row == WHITE_PAWN_START_ROW
    && gameSnapshot.lastMove.destination.row == WHITE_PAWN_START_JUMP_ROW
    && destination.col == gameSnapshot.lastMove.destination.col
  ) {
    nextGameSnapshot.board[gameSnapshot.lastMove.destination.col][gameSnapshot.lastMove.destination.row] = __;
  }

  if (
    pieceMoved == WK
    && areSamePositions(origin, WHITE_CASTLING_KING_SIDE.kingOrigin)
    && areSamePositions(destination, WHITE_CASTLING_KING_SIDE.kingDestination)
  ) {
    moveTo(nextGameSnapshot.board, WHITE_CASTLING_KING_SIDE.rookOrigin, WHITE_CASTLING_KING_SIDE.rookDestination);
  }

  if (
    pieceMoved == WK
    && areSamePositions(origin, WHITE_CASTLING_QUEEN_SIDE.kingOrigin)
    && areSamePositions(destination, WHITE_CASTLING_QUEEN_SIDE.kingDestination)
  ) {
    moveTo(nextGameSnapshot.board, WHITE_CASTLING_QUEEN_SIDE.rookOrigin, WHITE_CASTLING_QUEEN_SIDE.rookDestination);
  }

  if (
    pieceMoved == BK
    && areSamePositions(origin, BLACK_CASTLING_KING_SIDE.kingOrigin)
    && areSamePositions(destination, BLACK_CASTLING_KING_SIDE.kingDestination)
  ) {
    moveTo(nextGameSnapshot.board, BLACK_CASTLING_KING_SIDE.rookOrigin, BLACK_CASTLING_KING_SIDE.rookDestination);
  }

  if (
    pieceMoved == BK
    && areSamePositions(origin, BLACK_CASTLING_QUEEN_SIDE.kingOrigin)
    && areSamePositions(destination, BLACK_CASTLING_QUEEN_SIDE.kingDestination)
  ) {
    moveTo(nextGameSnapshot.board, BLACK_CASTLING_QUEEN_SIDE.rookOrigin, BLACK_CASTLING_QUEEN_SIDE.rookDestination);
  }

  if (pieceMoved == WK || pieceMoved == WR) {
    nextGameSnapshot.hasWhiteLostCastling = true;
  }

  if (pieceMoved == BK || pieceMoved == BR) {
    nextGameSnapshot.hasBlackLostCastling = true;
  }

  if (!canPromote(nextGameSnapshot, destination)) {
    nextGameSnapshot.currentPlayer = gameSnapshot.currentPlayer == WHITE ? BLACK : WHITE;
  }

  nextGameSnapshot.lastMove.origin = origin;
  nextGameSnapshot.lastMove.destination = destination;

  return nextGameSnapshot;
}

function appliedPromotion(gameSnapshot: GameSnapshot, origin: Position, promotion: Piece): GameSnapshot {
  const nextGameSnapshot: GameSnapshot = copyOfGameSnapshot(gameSnapshot);

  nextGameSnapshot.board[origin.col][origin.row] = promotion;
  nextGameSnapshot.currentPlayer = gameSnapshot.currentPlayer == WHITE ? BLACK : WHITE;

  return nextGameSnapshot;
}

export function positionOfPiece(board: GameBoard, piece: Piece): Position {
  const position: Position = { col: -1, row: -1 };

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      if (board[col][row] == piece) {
        position.col = col;
        position.row = row;
      }
    }
  }

  return position;
}

export function isEmptyAtColRow(board: GameBoard, col: number, row: number): boolean {
  return pieceAtColRow(board, col, row) == __;
}

export function isEmptyAt(board: GameBoard, position: Position): boolean {
  return pieceAt(board, position) == __;
}

function isColumnEmptyBetween(board: GameBoard, start: Position, end: Position): boolean {
  if (start.col != end.col) {
    return false;
  }

  const rowStart: number = start.row <= end.row ? start.row : end.row;
  const rowEnd: number = start.row <= end.row ? end.row : start.row;

  for (let row = rowStart + 1; row < rowEnd; row++) {
    if (pieceAtColRow(board, start.col, row)) {
      return false;
    }
  }

  return true;
}

function isRowEmptyBetween(board: GameBoard, start: Position, end: Position): boolean {
  if (start.row != end.row) {
    return false;
  }

  const colStart: number = start.col <= end.col ? start.col : end.col;
  const colEnd: number = start.col <= end.col ? end.col : start.col;

  for (let col = colStart + 1; col < colEnd; col++) {
    if (pieceAtColRow(board, col, start.row)) {
      return false;
    }
  }

  return true;
}

function isDiagonalEmptyBetween(board: GameBoard, start: Position, end: Position): boolean {
  const dx: number = end.col - start.col;
  const dy: number = end.row - start.row;

  if (Math.abs(dx) != Math.abs(dy)) {
    return false;
  }

  const steps: number = Math.abs(dx); // Nombre de cases à parcourir
  const xStep: number = dx / steps; // Direction en x (+1 ou -1)
  const yStep: number = dy / steps; // Direction en y (+1 ou -1)

  for (let i = 1; i < steps; i++) {
    const col: number = start.col + i * xStep;
    const row: number = start.row + i * yStep;
    if (pieceAtColRow(board, col, row)) {
      return false;
    }
  }

  return true;
}

function isPositionOnBoard(position: Position): boolean {
  return 0 <= position.col && position.col < COLS && 0 <= position.row && position.row < ROWS;
}

function isMoveValid(gameSnapshot: GameSnapshot, origin: Position, destination: Position): boolean {
  const pieceAtOrigin: Piece = pieceAt(gameSnapshot.board, origin);
  const pieceColorAtOrigin: Color = pieceColor(pieceAtOrigin);
  const pieceAtDestination: Piece = pieceAt(gameSnapshot.board, destination);
  const pieceColorAtDestination: Color = pieceColor(pieceAtDestination);

  if (!isPositionOnBoard(destination)) {
    return false;
  }

  if (!pieceAtOrigin) {
    return false;
  }

  if (pieceAtDestination && pieceColorAtDestination == pieceColorAtOrigin) {
    return false;
  }

  if (pieceAtOrigin == WP) {
    if (pieceAtDestination) {
      return areSamePositions(destination, atDirection(origin, TOP_LEFT, 1))
        || areSamePositions(destination, atDirection(origin, TOP_RIGHT, 1));
    }

    if (
      origin.row == WHITE_PAWN_START_ROW
      && destination.row == WHITE_PAWN_START_JUMP_ROW
      && isColumnEmptyBetween(gameSnapshot.board, origin, destination)
    ) {
      return true;
    }

    if (
      origin.row == BLACK_PAWN_START_JUMP_ROW
      && (
        areSamePositions(destination, atDirection(origin, TOP_LEFT, 1))
        || areSamePositions(destination, atDirection(origin, TOP_RIGHT, 1))
      )
      && pieceAt(gameSnapshot.board, gameSnapshot.lastMove.destination) == BP
      && gameSnapshot.lastMove.origin.row == BLACK_PAWN_START_ROW
      && gameSnapshot.lastMove.destination.row == BLACK_PAWN_START_JUMP_ROW
      && destination.col == gameSnapshot.lastMove.destination.col
    ) {
      return true;
    }

    return areSamePositions(destination, atDirection(origin, TOP, 1));
  }

  if (pieceAtOrigin == BP) {
    if (pieceAtDestination) {
      return areSamePositions(destination, atDirection(origin, BOTTOM_LEFT, 1))
        || areSamePositions(destination, atDirection(origin, BOTTOM_RIGHT, 1));
    }

    if (
      origin.row == BLACK_PAWN_START_ROW
      && destination.row == BLACK_PAWN_START_JUMP_ROW
      && isColumnEmptyBetween(gameSnapshot.board, origin, destination)
    ) {
      return true;
    }

    if (
      origin.row == WHITE_PAWN_START_JUMP_ROW
      && (
        areSamePositions(destination, atDirection(origin, BOTTOM_LEFT, 1))
        || areSamePositions(destination, atDirection(origin, BOTTOM_RIGHT, 1))
      )
      && pieceAt(gameSnapshot.board, gameSnapshot.lastMove.destination) == WP
      && gameSnapshot.lastMove.origin.row == WHITE_PAWN_START_ROW
      && gameSnapshot.lastMove.destination.row == WHITE_PAWN_START_JUMP_ROW
      && destination.col == gameSnapshot.lastMove.destination.col
    ) {
      return true;
    }

    return areSamePositions(destination, atDirection(origin, BOTTOM, 1));
  }

  if (pieceAtOrigin == WN || pieceAtOrigin == BN) {
    return (rowsBetween(origin, destination) == 2 && colsBetween(origin, destination) == 1)
      || (rowsBetween(origin, destination) == 1 && colsBetween(origin, destination) == 2);
  }

  if (pieceAtOrigin == WK || pieceAtOrigin == BK) {
    const kingSide: CastlingPositions = gameSnapshot.currentPlayer == WHITE ? WHITE_CASTLING_KING_SIDE : BLACK_CASTLING_KING_SIDE;
    const queenSide: CastlingPositions = gameSnapshot.currentPlayer == WHITE ? WHITE_CASTLING_QUEEN_SIDE : BLACK_CASTLING_QUEEN_SIDE;
    const hasLostCastling: boolean = gameSnapshot.currentPlayer == WHITE ? gameSnapshot.hasWhiteLostCastling : gameSnapshot.hasBlackLostCastling;

    const isCastlingKingSide = areSamePositions(origin, kingSide.kingOrigin) && areSamePositions(destination, kingSide.kingDestination);
    if (isCastlingKingSide) {
      const nextSnapshot = appliedMove(gameSnapshot, origin, destination);

      return !hasLostCastling
        && isRowEmptyBetween(gameSnapshot.board, kingSide.kingOrigin, kingSide.rookOrigin)
        && !isPlayerInCheck(gameSnapshot, gameSnapshot.currentPlayer)
        && !isPieceThreatened(nextSnapshot, kingSide.rookDestination);
    }

    const isCastlingQueenSide = areSamePositions(origin, queenSide.kingOrigin) && areSamePositions(destination, queenSide.kingDestination);
    if (isCastlingQueenSide) {
      const nextSnapshot = appliedMove(gameSnapshot, origin, destination);

      return !hasLostCastling
        && isRowEmptyBetween(gameSnapshot.board, queenSide.kingOrigin, queenSide.rookOrigin)
        && !isPlayerInCheck(gameSnapshot, gameSnapshot.currentPlayer)
        && !isPieceThreatened(nextSnapshot, queenSide.rookDestination);
    }

    return rowsBetween(origin, destination) <= 1 && colsBetween(origin, destination) <= 1;
  }

  if (pieceAtOrigin == WR || pieceAtOrigin == BR) {
    return isRowEmptyBetween(gameSnapshot.board, origin, destination)
      || isColumnEmptyBetween(gameSnapshot.board, origin, destination);
  }

  if (pieceAtOrigin == WB || pieceAtOrigin == BB) {
    return isDiagonalEmptyBetween(gameSnapshot.board, origin, destination);
  }

  if (pieceAtOrigin == WQ || pieceAtOrigin == BQ) {
    return isRowEmptyBetween(gameSnapshot.board, origin, destination)
      || isColumnEmptyBetween(gameSnapshot.board, origin, destination)
      || isDiagonalEmptyBetween(gameSnapshot.board, origin, destination);
  }

  return false;
}

function isPieceThreatened(gameSnapshot: GameSnapshot, piece: Position): boolean {
  if (!isPositionOnBoard(piece)) {
    return false;
  }

  const attacker: Position = { col: -1, row: -1 };
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      attacker.col = col;
      attacker.row = row;

      if (areSamePositions(piece, attacker)) {
        continue;
      }

      if (isMoveValid(gameSnapshot, attacker, piece)) {
        return true;
      }
    }
  }

  return false;
}

export function isPlayerInCheck(gameSnapshot: GameSnapshot, player: Color): boolean {
  const kingPosition: Position = positionOfPiece(gameSnapshot.board, player == WHITE ? WK : BK);

  return isPieceThreatened(gameSnapshot, kingPosition);
}

function canPlayWithoutBeingInCheck(gameSnapshot: GameSnapshot, origin: Position, destination: Position): boolean {
  const pieceColorAtOrigin: Color = pieceColor(pieceAt(gameSnapshot.board, origin));

  if (pieceColorAtOrigin != gameSnapshot.currentPlayer) {
    return false;
  }

  if (!isMoveValid(gameSnapshot, origin, destination)) {
    return false;
  }

  const nextSnapshot: GameSnapshot = appliedMove(gameSnapshot, origin, destination);

  return !isPlayerInCheck(nextSnapshot, gameSnapshot.currentPlayer);
}

export function isCurrentPlayerStalemated(gameSnapshot: GameSnapshot): boolean {
  const origin: Position = { col: -1, row: -1 };
  const destination: Position = { col: -1, row: -1 };
  let originPiece: Piece = __;

  for (let originRow = 0; originRow < ROWS; originRow++) {
    for (let originCol = 0; originCol < COLS; originCol++) {
      origin.col = originCol;
      origin.row = originRow;

      originPiece = pieceAt(gameSnapshot.board, origin);

      if (originPiece == __ && pieceColor(originPiece) != gameSnapshot.currentPlayer) {
        continue;
      }

      for (let destinationRow = 0; destinationRow < ROWS; destinationRow++) {
        for (let destinationCol = 0; destinationCol < COLS; destinationCol++) {
          destination.col = destinationCol;
          destination.row = destinationRow;

          if (canPlayWithoutBeingInCheck(gameSnapshot, origin, destination)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

export function isCurrentPlayerCheckmated(gameSnapshot: GameSnapshot): boolean {
  return isCurrentPlayerStalemated(gameSnapshot) && isPlayerInCheck(gameSnapshot, gameSnapshot.currentPlayer);
}

export function canPlay(gameSnapshot: GameSnapshot, origin: Position, destination: Position): boolean {
  return canPlayWithoutBeingInCheck(gameSnapshot, origin, destination) && !isCurrentPlayerCheckmated(gameSnapshot);
}

export function canPromote(gameSnapshot: GameSnapshot, origin: Position): boolean {
  const piece: Piece = pieceAt(gameSnapshot.board, origin);
  const color: Color = pieceColor(piece);

  if (color != gameSnapshot.currentPlayer) {
    return false;
  }

  if (piece == WP) {
    return origin.row == WHITE_PAWN_ROW_PROMOTION;
  }

  if (piece == BP) {
    return origin.row == BLACK_PAWN_ROW_PROMOTION;
  }

  return false;
}

function isAPromotionPiece(piece: Piece): boolean {
  return piece == WQ
    || piece == WB
    || piece == WR
    || piece == WN
    || piece == BQ
    || piece == BB
    || piece == BR
    || piece == BN;
}

export function canPromoteTo(gameSnapshot: GameSnapshot, origin: Position, promotion: Piece): boolean {
  return canPromote(gameSnapshot, origin)
    && pieceColor(promotion) == gameSnapshot.currentPlayer
    && isAPromotionPiece(promotion);
}

export function play(gameSnapshot: GameSnapshot, origin: Position, destination: Position): GameSnapshot {
  if (!canPlay(gameSnapshot, origin, destination)) {
    throw new Error("Can't play this move");
  }

  return appliedMove(gameSnapshot, origin, destination);
}

export function promoteTo(gameSnapshot: GameSnapshot, origin: Position, promotion: Piece): GameSnapshot {
  if (!canPromote(gameSnapshot, origin)) {
    throw new Error("Can't promote to this piece");
  }

  return appliedPromotion(gameSnapshot, origin, promotion);
}

function constructBoard(board: GameBoard): void {
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      board[col][row] = __;
    }
  }
}

function fillBoardWithInitialPieces(board: GameBoard): void {
  constructBoard(board);

  board[0][0] = WR;
  board[1][0] = WN;
  board[2][0] = WB;
  board[4][0] = WK;
  board[3][0] = WQ;
  board[5][0] = WB;
  board[6][0] = WN;
  board[7][0] = WR;
  for (let row = 0; row < ROWS; row++) {
    board[row][1] = WP;
  }

  board[0][7] = BR;
  board[1][7] = BN;
  board[2][7] = BB;
  board[4][7] = BK;
  board[3][7] = BQ;
  board[5][7] = BB;
  board[6][7] = BN;
  board[7][7] = BR;
  for (let row = 0; row < ROWS; row++) {
    board[row][6] = BP;
  }
}

export function createGameSnapshot(): GameSnapshot {
  return {
    board: [
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __],
      [__, __, __, __, __, __, __, __]
    ],
    currentPlayer: WHITE,
    hasWhiteLostCastling: false,
    hasBlackLostCastling: false,
    lastMove: {
      origin: { col: -1, row: -1 },
      destination: { col: -1, row: -1 }
    }
  };
}

export function initialGameSnapshot(): GameSnapshot {
  const gameSnapshot: GameSnapshot = createGameSnapshot();

  fillBoardWithInitialPieces(gameSnapshot.board);

  return gameSnapshot;
}
