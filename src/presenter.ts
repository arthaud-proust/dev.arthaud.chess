import "./presenter.css";

import {
  __,
  areSamePositions,
  BB,
  BK,
  BLACK,
  BN,
  BP,
  BQ,
  BR,
  Color,
  COLS,
  GameBoard,
  pieceAt,
  Position,
  ROWS,
  WB,
  WHITE,
  WK,
  WN,
  WP,
  WQ,
  WR
} from "./rules.ts";

const isEven = (x: number) => (x % 2) == 0;
const isCaseBlack = ({ row, col }: Position) => {
  return (isEven(col) && isEven(row)) || (!isEven(col) && !isEven(row));
};

export const setupPresenter = ({ container, onCaseClick, onPromoteTo }: {
  container: HTMLElement,
  onCaseClick: (position: Position) => void,
  onPromoteTo: (piece: string) => void;
}) => {
  container.innerHTML = `
  <div class="board">
    <dialog class="endGameModal">
      <p class="endGameModal__sentence"></p>
      <a href="/">New game</a>
    </dialog>
     <dialog class="promotionModal">
      <p>How do you promote your pawn ?</p>
      <button data-piece="queen">Queen</button>
      <button data-piece="rook">Rook</button>
      <button data-piece="knight">Knight</button>
      <button data-piece="bishop">Bishop</button>
    </dialog>
  </div>
  <div class="players">
    <div class="whitePlayer">White player</div>
    <div class="blackPlayer">Black player</div>
  </div>
  `;

  const boardEl: HTMLDivElement = container.querySelector(".board")!;
  const whitePlayerEl: HTMLDivElement = container.querySelector(".whitePlayer")!;
  const blackPlayerEl: HTMLDivElement = container.querySelector(".blackPlayer")!;

  const endGameModalEl: HTMLDialogElement = container.querySelector(".endGameModal")!;

  const promotionModalEl: HTMLDialogElement = container.querySelector(".promotionModal")!;
  const promotionModalBtnEls: NodeListOf<HTMLButtonElement> = container.querySelectorAll(".promotionModal button")!;
  promotionModalBtnEls.forEach((btnEl: HTMLButtonElement) => {
    const piece = btnEl.dataset.piece!;

    btnEl.addEventListener("click", () => {
      onPromoteTo(piece);
      promotionModalEl.close();
    });
  });

  const boardCaseEls: HTMLDivElement[][] = [];

  for (let col = 0; col < COLS; col++) {
    const colEls = [];

    for (let row = 0; row < ROWS; row++) {
      const boardCaseEl = document.createElement("div");

      boardCaseEl.classList.add(
        "board__case",
        `board__case--${row}${col}`,
        isCaseBlack({ col, row }) ? `board__case--black` : `board__case--white`
      );

      boardEl.append(boardCaseEl);

      colEls.push(boardCaseEl);

      boardCaseEl.addEventListener("click", () => {
        onCaseClick({ col, row });
      });
    }

    boardCaseEls.push(colEls);
  }


  const updateCurrentPlayer = (player: Color) => {
    whitePlayerEl.classList.toggle(`whitePlayer--active`, player === WHITE);
    blackPlayerEl.classList.toggle(`blackPlayer--active`, player === BLACK);
  };

  const contentForPiece = {
    [__]: "",
    [WK]: "<img src=\"/pieces/WK.png\" alt=\"White King\"/>",
    [WQ]: "<img src=\"/pieces/WQ.png\" alt=\"White Queen\"/>",
    [WB]: "<img src=\"/pieces/WB.png\" alt=\"White Bishop\"/>",
    [WR]: "<img src=\"/pieces/WR.png\" alt=\"White Rook\"/>",
    [WN]: "<img src=\"/pieces/WN.png\" alt=\"White Knight\"/>",
    [WP]: "<img src=\"/pieces/WP.png\" alt=\"White Pawn\"/>",
    [BK]: "<img src=\"/pieces/BK.png\" alt=\"Black King\"/>",
    [BQ]: "<img src=\"/pieces/BQ.png\" alt=\"Black Queen\"/>",
    [BB]: "<img src=\"/pieces/BB.png\" alt=\"Black Bishop\"/>",
    [BR]: "<img src=\"/pieces/BR.png\" alt=\"Black Rook\"/>",
    [BN]: "<img src=\"/pieces/BN.png\" alt=\"Black Knight\"/>",
    [BP]: "<img src=\"/pieces/BP.png\" alt=\"Black Pawn\"/>"
  };

  const renderBoard = (board: GameBoard, activePosition?: Position) => {
    boardCaseEls.forEach((colEls, col) => {
      colEls.forEach((caseEl, row) => {
        caseEl.innerHTML = contentForPiece[pieceAt(board, { col, row })];
        caseEl.classList.toggle("board__case--active", !!activePosition && areSamePositions({ col, row }, activePosition));
      });
    });
  };

  const render = (currentPlayer: Color, board: GameBoard, activePosition?: Position) => {
    updateCurrentPlayer(currentPlayer);

    renderBoard(board, activePosition);
  };

  const renderStalemate = () => {
    endGameModalEl.showModal();

    const sentenceEl: HTMLParagraphElement = endGameModalEl.querySelector(".endGameModal__sentence")!;

    sentenceEl.innerHTML = "Equality";
  };

  const renderCheckmate = (winner: Color) => {
    endGameModalEl.showModal();

    const sentenceEl: HTMLParagraphElement = endGameModalEl.querySelector(".endGameModal__sentence")!;

    sentenceEl.innerHTML = `${winner === WHITE ? "White" : "Black"} player has won`;
  };

  const openPromotionModal = () => {
    promotionModalEl.showModal();
  };

  return { render, renderStalemate, renderCheckmate, openPromotionModal };
};