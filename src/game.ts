import {
  canPromote,
  GameSnapshot,
  initialGameSnapshot,
  isCurrentPlayerCheckmated,
  isCurrentPlayerStalemated,
  Move,
  Piece,
  play,
  Position,
  promoteTo
} from "./rules.ts";

export class Game {
  private snapshot: GameSnapshot;

  constructor() {
    this.snapshot = initialGameSnapshot();
  }

  get currentPlayer() {
    return this.snapshot.currentPlayer;
  }

  play({ origin, destination }: Move) {
    this.snapshot = play(this.snapshot, origin, destination);
  }

  canPromote(position: Position) {
    return canPromote(this.snapshot, position);
  }

  promoteTo(position: Position, piece: Piece) {
    this.snapshot = promoteTo(this.snapshot, position, piece);
  }

  get isCurrentPlayerCheckmated() {
    return isCurrentPlayerCheckmated(this.snapshot);
  }

  get isCurrentPlayerStalemated() {
    return isCurrentPlayerStalemated(this.snapshot);
  }

  get board() {
    return this.snapshot.board;
  }
}