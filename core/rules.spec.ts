import { describe, expect, it } from "vitest";
import {
  areSamePositions,
  canPlay,
  canPromote,
  canPromoteTo,
  Colors,
  COLS,
  type GameSnapshot,
  isCurrentPlayerCheckmated,
  isCurrentPlayerStalemated,
  isPlayerInCheck,
  pieceAt,
  Pieces,
  play,
  type Position,
  positionOfPiece,
  promoteTo,
  ROWS
} from "./rules";

type PlayableMoves = (0 | 1)[][];

const { WHITE, BLACK } = Colors;
const { __, WK, WQ, WB, WR, WN, WP, BK, BQ, BB, BR, BP } = Pieces;

function assertPlayableMovesMatch(
  gameSnapshot: GameSnapshot,
  pieceToMove: Position,
  playableMoves: PlayableMoves
) {
  expect(pieceToMove.col).toBeGreaterThan(-1);
  expect(pieceToMove.row).toBeGreaterThan(-1);

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const expectedCanMove = playableMoves[col][row];
      const destination: Position = { col, row };
      expect
        .soft(
          canPlay(gameSnapshot, pieceToMove, destination),
          `Expect ${pieceToMove.col}${pieceToMove.row} -> ${destination.col}${destination.row} to be ${!!expectedCanMove}`
        )
        .toBe(!!expectedCanMove);
    }
  }
}

describe("all", () => {
  it("cannot_move_other_color", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, BP, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, BP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("cannot_move_piece_on_another_if_same_colour", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, WP, WP, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = { col: 3, row: 2 };

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("cannot_move_piece_out_of_board", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WP],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);

    const outOfBoard: Position = { col: 3, row: 8 };

    expect(canPlay(gameSnapshot, pieceToMove, outOfBoard)).toBe(false);
  });

  it("cannot_move_if_it_put_king_in_check", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, BQ, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, WP, __, __, __, __, __],
        [__, WK, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });
});

describe("pawn", () => {
  it("white_can_move_1_cell_front_when_not_at_start_row", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, WP, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("white_can_move_1_or_2_cells_front_when_at_start_row", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, WP, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("white_cannot_move_2_cells_front_when_piece_in_front_of_it", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, WP, BP, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("white_can_eat_at_front_left_or_front_right", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, BP, __, __, __, __],
        [__, __, WP, BP, __, __, __, __],
        [__, __, __, BP, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("white_can_eat_en_passant", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, BP, __, __, __],
        [__, __, __, __, WP, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: 0, row: 6 },
        destination: { col: 0, row: 4 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("black_can_move_1_cell_front_when_not_at_start_row", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, BP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("black_can_move_1_or_2_cells_front_when_at_start_row", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, BP, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, BP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("black_cannot_move_2_cells_front_when_piece_in_front_of_it", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, WP, BP, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, BP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("black_can_eat_at_front_left_or_front_right", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, WP, __, __, __],
        [__, __, __, __, WP, BP, __, __],
        [__, __, __, __, WP, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, BP);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("black_can_eat_en_passant", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, WP, __, __, __, __],
        [__, __, __, BP, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: 0, row: 1 },
        destination: { col: 0, row: 3 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, BP);

    const playableMoves: PlayableMoves = [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("dont_change_player_if_pawn_is_promoting", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, BP],
        [__, __, __, __, __, __, WP, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);
    const destination: Position = positionOfPiece(gameSnapshot.board, BP);

    const resultSnapshot = play(gameSnapshot, pieceToMove, destination);

    expect(resultSnapshot.currentPlayer).toBe(WHITE);
  });
});

describe("knight", () => {
  it("can_move_in_l_shape", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WN, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WN);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });
});

describe("king", () => {
  it("can_move_in_any_direction_at_distance_of_1", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WK, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("cannot_move_where_it_will_be_in_check", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WK, __, __, __, __],
        [__, __, __, __, __, BQ, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("can_castle_kingside", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(true);
  });

  it("can_castle_kingside_if_queen_rock_moved", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: true
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(true);
  });

  it("cannot_castle_kingside_when_piece_between", () => {
    const gameSnapshot1: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WN, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const gameSnapshot2: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [WB, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot1.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot1, pieceToMove, destination)).toBe(false);
    expect(canPlay(gameSnapshot2, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_kingside_when_king_rook_moved", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: true,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_kingside_when_king_moved", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: true,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_kingside_when_king_is_in_check", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, BR, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_kingside_if_king_will_be_in_check", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, BR, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_kingside_if_king_will_go_trough_threatened_case", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, BR, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("can_castle_queenside", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(true);
  });

  it("can_castle_queenside_if_king_rook_moved", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: true,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(true);
  });

  it("cannot_castle_queenside_when_piece_between", () => {
    const gameSnapshot1: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [WN, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const gameSnapshot2: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WB, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const gameSnapshot3: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WQ, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot1.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot1, pieceToMove, destination)).toBe(false);
    expect(canPlay(gameSnapshot2, pieceToMove, destination)).toBe(false);
    expect(canPlay(gameSnapshot3, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_queenside_when_queen_rook_moved", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: true
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_queenside_when_king_moved", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: true,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_queenside_when_king_is_in_check", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, BR, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_queenside_if_king_will_be_in_check", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, BR, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });

  it("cannot_castle_queenside_if_king_will_go_trough_threatened_case", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, BR, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    expect(canPlay(gameSnapshot, pieceToMove, destination)).toBe(false);
  });
});

describe("rook", () => {
  it("can_move_in_column_or_row_at_any_distance", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WR, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WR);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 1, 1],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("cannot_go_over_pieces", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, BP, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, BP, __, WR, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, BP, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WR);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });
});

describe("rook", () => {
  it(" can_move_in_diagonal_at_any_distance", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WB, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WB);

    const playableMoves: PlayableMoves = [
      [1, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it(" cannot_go_over_pieces", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, BP, __, __, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WB, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, BP, __, __, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WB);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });
});

describe("queen", () => {
  it("can_move_in_column_or_row_or_diagonal_at_any_distance", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WQ, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WQ);

    const playableMoves: PlayableMoves = [
      [1, 0, 0, 1, 0, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });

  it("cannot_go_over_pieces", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, BP, __, BP, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, BP, __, WQ, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, BP, __, BP, __, BP, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WQ);

    const playableMoves: PlayableMoves = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    assertPlayableMovesMatch(gameSnapshot, pieceToMove, playableMoves);
  });
});

describe("isPlayerInCheck", () => {
  it("should_return_true_when_a_piece_can_eat_king", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WK, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, BQ, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isPlayerInCheck(gameSnapshot, WHITE)).toBe(true);
  });

  it("should_return_false_when_none_piece_can_eat_king", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, WK, __, __, __, __],
        [__, __, __, __, WP, __, __, __],
        [__, __, __, __, __, BQ, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isPlayerInCheck(gameSnapshot, WHITE)).toBe(false);
  });
});

describe("play", () => {
  it("save_current_move_as_last_move_in_next_snapshot", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, BP, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = positionOfPiece(gameSnapshot.board, BP);

    const resultSnapshot = play(gameSnapshot, origin, destination);
    expect(areSamePositions(resultSnapshot.lastMove.origin, origin)).toBe(true);
    expect(
      areSamePositions(resultSnapshot.lastMove.destination, destination)
    ).toBe(true);
  });

  it("mark_king_as_moved_if_so", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, BR, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = positionOfPiece(gameSnapshot.board, BR);

    const resultSnapshot = play(gameSnapshot, origin, destination);
    expect(resultSnapshot.movedWhitePieces.king).toBe(true);
  });

  it("mark_king_rook_as_moved_if_so", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, BR, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WR);
    const destination: Position = positionOfPiece(gameSnapshot.board, BR);

    const resultSnapshot = play(gameSnapshot, origin, destination);
    expect(resultSnapshot.movedWhitePieces.kingRook).toBe(true);
  });

  it("mark_queen_rook_as_moved_if_so", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, BR, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WR);
    const destination: Position = positionOfPiece(gameSnapshot.board, BR);

    const resultSnapshot = play(gameSnapshot, origin, destination);
    expect(resultSnapshot.movedWhitePieces.queenRook).toBe(true);
  });

  it("move_king_and_rook_when_castling_queenside", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [WR, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 2, row: 0 };

    const resultSnapshot = play(gameSnapshot, origin, destination);

    expect(resultSnapshot.board[2][0]).toBe(WK);
    expect(resultSnapshot.board[3][0]).toBe(WR);
  });

  it("move_king_and_rook_when_castling_kingside", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WK, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [WR, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WK);
    const destination: Position = { col: 6, row: 0 };

    const resultSnapshot = play(gameSnapshot, origin, destination);

    expect(resultSnapshot.board[6][0]).toBe(WK);
    expect(resultSnapshot.board[5][0]).toBe(WR);
  });

  it("eat_pawn_en_passant", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, BP, __, __, __],
        [__, __, __, __, WP, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: 0, row: 6 },
        destination: { col: 0, row: 4 }
      }
    };
    const pieceToMove: Position = positionOfPiece(gameSnapshot.board, WP);
    const destination: Position = { col: 0, row: 5 };

    const resultSnapshot = play(gameSnapshot, pieceToMove, destination);

    expect(resultSnapshot.board[0][4]).toBe(__);
    expect(resultSnapshot.board[0][5]).toBe(WP);
  });
});

describe("canPromote", () => {
  it("return_true_when_white_pawn_is_at_end_of_board", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WP],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WP);

    expect(canPromote(gameSnapshot, origin)).toBe(true);
  });

  it("return_true_when_black_pawn_is_at_end_of_board", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [BP, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, BP);

    expect(canPromote(gameSnapshot, origin)).toBe(true);
  });
});

describe("canPromoteTo", () => {
  it("return_false_if_promoting_other_color", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WP],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WP);

    expect(canPromoteTo(gameSnapshot, origin, WQ)).toBe(false);
  });
});

describe("promote", () => {
  it("replace_pawn_by_promotion_piece", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WP],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WP);

    const resultSnapshot = promoteTo(gameSnapshot, origin, WQ);

    expect(pieceAt(resultSnapshot.board, origin)).toBe(WQ);
  });

  it("change turn", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WP],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: WHITE,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };
    const origin: Position = positionOfPiece(gameSnapshot.board, WP);

    const resultSnapshot = promoteTo(gameSnapshot, origin, WQ);

    expect(resultSnapshot.currentPlayer).toBe(BLACK);
  });
});

describe("isCurrentPlayerCheckmated", () => {
  it("return_true_when_king_is_in_check_but_cannot_move_and_no_piece_can_move_to_protect_the_king", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, WR],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, WK, __, BK],
        [__, __, __, __, __, __, __, BB],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WR]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isCurrentPlayerCheckmated(gameSnapshot)).toBe(true);
  });

  it("return_false_when_king_can_move", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, BK],
        [__, __, __, __, __, WK, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, WR]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isCurrentPlayerCheckmated(gameSnapshot)).toBe(false);
  });

  it("return_false_when_a_piece_can_move_to_protect_the_king", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, BK],
        [__, __, __, __, __, __, __, WR],
        [__, __, __, __, __, WQ, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isCurrentPlayerCheckmated(gameSnapshot)).toBe(false);
  });
});

describe("isCurrentPlayerStalemated", () => {
  it("return_true_when_player_cannot_play_anything", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, __, __, __, BK],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, WQ, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isCurrentPlayerStalemated(gameSnapshot)).toBe(true);
  });

  it("return_false_when_player_can_play_something", () => {
    const gameSnapshot: GameSnapshot = {
      board: [
        [__, __, __, __, BP, __, __, BK],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, WQ, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __],
        [__, __, __, __, __, __, __, __]
      ],
      currentPlayer: BLACK,
      movedWhitePieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      movedBlackPieces: {
        king: false,
        kingRook: false,
        queenRook: false
      },
      lastMove: {
        origin: { col: -1, row: -1 },
        destination: { col: -1, row: -1 }
      }
    };

    expect(isCurrentPlayerStalemated(gameSnapshot)).toBe(false);
  });
});
