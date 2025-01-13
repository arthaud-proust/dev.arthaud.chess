import "./style.css";
import { setupDOM } from "./dom.ts";
import { Game } from "./game.ts";
import { BB, BN, BQ, BR, GameBoard, Move, pieceAt, Position, WB, WHITE, WN, WQ, WR } from "./rules.ts";

const app = document.getElementById("app");
if (!app) throw new Error("Could not find #app element");

const game = new Game();

type PlayHandlerOnPlayFn = (move: Move) => void;

class PlayHandler {
  private _origin?: Position;
  private _destination?: Position;

  private readonly onPlayFn: PlayHandlerOnPlayFn;

  constructor(onPlayFn: PlayHandlerOnPlayFn) {
    this.onPlayFn = onPlayFn;
  }

  reset() {
    this._origin = undefined;
    this._destination = undefined;
  }

  register(board: GameBoard, position: Position) {
    if (!this._origin && pieceAt(board, position)) {
      this._origin = position;
      return;
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

const {
  render,
  renderStalemate,
  renderCheckmate,
  openPromotionModal
} = setupDOM({
  container: app,
  onCaseClick: (position) => {
    playHandler.register(game.board, position);
    render(game.currentPlayer, game.board, playHandler.origin);
  },
  onPromoteTo: (piece: string) => {
    if (!playHandler.destination) return;

    try {
      if (piece === "queen") game.promoteTo(playHandler.destination, game.currentPlayer === WHITE ? WQ : BQ);
      if (piece === "rook") game.promoteTo(playHandler.destination, game.currentPlayer === WHITE ? WR : BR);
      if (piece === "knight") game.promoteTo(playHandler.destination, game.currentPlayer === WHITE ? WN : BN);
      if (piece === "bishop") game.promoteTo(playHandler.destination, game.currentPlayer === WHITE ? WB : BB);
    } catch (e) {
      playHandler.reset();
    }

    render(game.currentPlayer, game.board, playHandler.origin);
  }
});

const playHandler = new PlayHandler((move) => {
  try {
    game.play(move);

    if (game.canPromote(move.destination)) {
      openPromotionModal();
      return;
    }

    if (game.isCurrentPlayerCheckmated) {
      renderCheckmate(game.currentPlayer);
      return;
    }

    if (game.isCurrentPlayerStalemated) {
      renderStalemate();
      return;
    }

    playHandler.reset();
  } catch (e) {
    playHandler.reset();
  }

  render(game.currentPlayer, game.board, playHandler.origin);
});


render(game.currentPlayer, game.board, playHandler.origin);