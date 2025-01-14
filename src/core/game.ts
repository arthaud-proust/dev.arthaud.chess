import {
  canPromote,
  copyOfGameSnapshot,
  type GameSnapshot,
  isCurrentPlayerCheckmated,
  isCurrentPlayerStalemated,
  type Move,
  type Piece,
  play,
  type Position,
  promoteTo
} from "./rules.ts";

export class Game {
  private history: Array<GameSnapshot>;
  private _snapshot: GameSnapshot;

  constructor(snapshot: GameSnapshot) {
    this.history = [];
    this._snapshot = snapshot;
  }

  get currentPlayer() {
    return this._snapshot.currentPlayer;
  }

  play({ origin, destination }: Move) {
    this.history.unshift(this._snapshot);
    this._snapshot = play(this._snapshot, origin, destination);
  }

  canPromote(position: Position) {
    return canPromote(this._snapshot, position);
  }

  promoteTo(position: Position, piece: Piece) {
    this.history.unshift(this._snapshot);
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

  get canUndo() {
    return this.history.length > 0;
  }

  undo() {
    const lastSnapshot = this.history.shift();

    if (lastSnapshot) {
      this._snapshot = lastSnapshot;
    }
  }
}