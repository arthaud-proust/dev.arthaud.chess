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
import { countPoints, eatenBlackPieces, eatenWhitePieces } from "@/core/piecesCounter.ts";

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

  get eatenWhitePieces() {
    return eatenWhitePieces(this._snapshot.board);
  }

  get eatenBlackPieces() {
    return eatenBlackPieces(this._snapshot.board);
  }

  get whitePoints() {
    const points = countPoints(this.eatenWhitePieces) - countPoints(this.eatenBlackPieces);
    if (points > 0) return points;
  }

  get blackPoints() {
    const points = countPoints(this.eatenBlackPieces) - countPoints(this.eatenWhitePieces);
    if (points > 0) return points;
  }

  undo() {
    const lastSnapshot = this.history.shift();

    if (lastSnapshot) {
      this._snapshot = lastSnapshot;
    }
  }
}