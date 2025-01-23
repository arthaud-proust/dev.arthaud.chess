import { z } from "zod";
import { Colors, Pieces } from "@/core/rules";

export const GameIdSchema = z.coerce.number().int();
export const PositionSchema = z.object({
  col: z.number().int().gte(-1).lte(7),
  row: z.number().int().gte(-1).lte(7)
});
export const PieceSchema = z.nativeEnum(Pieces);

export const GameBoardSchema = z.tuple([
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema]),
  z.tuple([PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema, PieceSchema])
]);

export const MoveSchema = z.object({
  origin: PositionSchema,
  destination: PositionSchema
});

export const MovedPiecesSchema = z.object({
  king: z.boolean(),
  kingRook: z.boolean(),
  queenRook: z.boolean()
});

export const GameSnapshotSchema = z.object({
  board: GameBoardSchema,
  currentPlayer: z.nativeEnum(Colors),
  movedWhitePieces: MovedPiecesSchema,
  movedBlackPieces: MovedPiecesSchema,
  lastMove: MoveSchema
});