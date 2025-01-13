import { setupPresenter } from "./presenter.ts";
import { Game } from "./game.ts";
import { BB, BN, BQ, BR, WB, WHITE, WN, WQ, WR } from "./rules.ts";
import { MoveHandler } from "./moveHandler.ts";

const app = document.getElementById("app");
if (!app) throw new Error("Could not find #app element");

const game = new Game();

const {
  render,
  renderStalemate,
  renderCheckmate,
  openPromotionModal
} = setupPresenter({
  container: app,
  onCaseClick: (position) => {
    moveHandler.register(game.board, position);
    render(game.currentPlayer, game.board, moveHandler.origin);
  },
  onPromoteTo: (piece: string) => {
    if (!moveHandler.destination) return;

    try {
      if (piece === "queen") game.promoteTo(moveHandler.destination, game.currentPlayer === WHITE ? WQ : BQ);
      if (piece === "rook") game.promoteTo(moveHandler.destination, game.currentPlayer === WHITE ? WR : BR);
      if (piece === "knight") game.promoteTo(moveHandler.destination, game.currentPlayer === WHITE ? WN : BN);
      if (piece === "bishop") game.promoteTo(moveHandler.destination, game.currentPlayer === WHITE ? WB : BB);
    } catch (e) {
      moveHandler.reset();
    }

    render(game.currentPlayer, game.board, moveHandler.origin);
  }
});

const moveHandler = new MoveHandler((move) => {
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

    moveHandler.reset();
  } catch (e) {
    moveHandler.reset();
  }

  render(game.currentPlayer, game.board, moveHandler.origin);
});


render(game.currentPlayer, game.board, moveHandler.origin);