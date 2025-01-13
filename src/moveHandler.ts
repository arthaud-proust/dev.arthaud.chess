import { GameSnapshot, Move, pieceAt, pieceColor, Position } from "./rules.ts";

type OnPlayFn = (move: Move) => void;

export class MoveHandler {
  private _origin?: Position;
  private _destination?: Position;

  private readonly onPlayFn: OnPlayFn;

  constructor(onPlayFn: OnPlayFn) {
    this.onPlayFn = onPlayFn;
  }

  reset() {
    this._origin = undefined;
    this._destination = undefined;
  }

  register(snapshot: GameSnapshot, position: Position) {
    if (!this._origin) {
      const piece = pieceAt(snapshot.board, position);

      if (piece && pieceColor(piece) === snapshot.currentPlayer) {
        this._origin = position;
        return;
      }
    }

    if (this._origin) {
      this._destination = position;

      this.onPlayFn({
        origin: this._origin,
        destination: this._destination
      });

      return;
    }

    this.reset();
  }

  get origin() {
    return this._origin;
  }

  get destination() {
    return this._destination;
  }
}