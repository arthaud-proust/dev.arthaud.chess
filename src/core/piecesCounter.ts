import { __, BB, BK, BN, BP, BQ, BR, type GameBoard, type Piece, WB, WK, WN, WP, WQ, WR } from "@/core/rules.ts";

const PIECES_POINTS = {
  [__]: 0,
  [WK]: Infinity,
  [WQ]: 9,
  [WR]: 5,
  [WN]: 3,
  [WB]: 3,
  [WP]: 1,
  [BK]: Infinity,
  [BQ]: 9,
  [BR]: 5,
  [BN]: 3,
  [BB]: 3,
  [BP]: 1
};

const INITIAL_WHITE_PIECES = [WK, WQ, WR, WR, WN, WN, WB, WB, WP, WP, WP, WP, WP, WP, WP, WP] as const;
const INITIAL_BLACK_PIECES = [BK, BQ, BR, BR, BN, BN, BB, BB, BP, BP, BP, BP, BP, BP, BP, BP] as const;

export const eatenWhitePieces = (board: GameBoard) => {
  const pieces: Piece[] = [...INITIAL_WHITE_PIECES];

  board.forEach((row) =>
    row.forEach((piece) => {
      const pieceIndex = pieces.indexOf(piece);
      if (pieceIndex > -1) {
        pieces.splice(pieceIndex, 1);
      }
    })
  );

  return pieces.sort((a, b) => PIECES_POINTS[b] - PIECES_POINTS[a]);
};

export const eatenBlackPieces = (board: GameBoard) => {
  const pieces: Piece[] = [...INITIAL_BLACK_PIECES];

  board.forEach((row) =>
    row.forEach((piece) => {
      const pieceIndex = pieces.indexOf(piece);
      if (pieceIndex > -1) {
        pieces.splice(pieceIndex, 1);
      }
    })
  );

  return pieces.sort((a, b) => PIECES_POINTS[b] - PIECES_POINTS[a]);
};

export const countPoints = (pieces: Piece[]) => pieces.reduce((total, piece) => total + PIECES_POINTS[piece], 0 as number);