import {
  canPromote,
  copyOfGameSnapshot,
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
  private _snapshot: GameSnapshot;

  constructor() {
    this._snapshot = initialGameSnapshot();
  }

  get currentPlayer() {
    return this._snapshot.currentPlayer;
  }

  play({ origin, destination }: Move) {
    this._snapshot = play(this._snapshot, origin, destination);
  }

  canPromote(position: Position) {
    return canPromote(this._snapshot, position);
  }

  promoteTo(position: Position, piece: Piece) {
    this._snapshot = promoteTo(this._snapshot, position, piece);
  }

  get isCurrentPlayerCheckmated() {
    return isCurrentPlayerCheckmated(this._snapshot);
  }

  get isCurrentPlayerStalemated() {
    return isCurrentPlayerStalemated(this._snapshot);
  }

  get snapshot() {
    return copyOfGameSnapshot(this._snapshot);
  }
}