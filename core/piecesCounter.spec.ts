import { describe, expect, test } from "vitest";
import { __, BB, BQ, BR, initialGameSnapshot, WB, WQ, WR } from "@/core/rules";
import {
  countPoints,
  eatenBlackPieces,
  eatenWhitePieces,
} from "@/core/piecesCounter";

describe("eatenWhitePieces", () => {
  test("given board with all pieces, return empty array", () => {
    const snapshot = initialGameSnapshot();
    expect(eatenWhitePieces(snapshot.board)).toStrictEqual([]);
  });

  test("given board without white queen, return array containing white queen", () => {
    const snapshot = initialGameSnapshot();
    snapshot.board[3][0] = __;
    expect(eatenWhitePieces(snapshot.board)).toStrictEqual([WQ]);
  });

  test("given board without black queen, return empty array", () => {
    const snapshot = initialGameSnapshot();
    snapshot.board[3][7] = __;
    expect(eatenWhitePieces(snapshot.board)).toStrictEqual([]);
  });

  test("order pieces by descending weight", () => {
    const snapshot = initialGameSnapshot();
    snapshot.board[0][0] = __;
    snapshot.board[2][0] = __;
    snapshot.board[3][0] = __;
    expect(eatenWhitePieces(snapshot.board)).toStrictEqual([WQ, WR, WB]);
  });
});

describe("eatenBlackPieces", () => {
  test("given board with all pieces, return empty array", () => {
    const snapshot = initialGameSnapshot();
    expect(eatenBlackPieces(snapshot.board)).toStrictEqual([]);
  });

  test("given board without black queen, return array containing black queen", () => {
    const snapshot = initialGameSnapshot();
    snapshot.board[3][7] = __;
    expect(eatenBlackPieces(snapshot.board)).toStrictEqual([BQ]);
  });

  test("given board without white queen, return empty array", () => {
    const snapshot = initialGameSnapshot();
    snapshot.board[3][0] = __;
    expect(eatenBlackPieces(snapshot.board)).toStrictEqual([]);
  });

  test("order pieces by descending weight", () => {
    const snapshot = initialGameSnapshot();
    snapshot.board[0][7] = __;
    snapshot.board[2][7] = __;
    snapshot.board[3][7] = __;
    expect(eatenBlackPieces(snapshot.board)).toStrictEqual([BQ, BR, BB]);
  });
});

describe("points", () => {
  test("return 0 for empty array", () => {
    expect(countPoints([])).toBe(0);
  });

  test("return 9 for queen", () => {
    expect(countPoints([WQ])).toBe(9);
  });
});
