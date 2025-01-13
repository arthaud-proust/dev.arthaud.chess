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

export const setupDOM = ({ container, onCaseClick, onPromoteTo }: {
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
    [WK]: "WK",
    [WQ]: "WQ",
    [WB]: "WB",
    [WR]: "WR",
    [WN]: "WN",
    [WP]: "WP",
    [BK]: "BK",
    [BQ]: "BQ",
    [BB]: "BB",
    [BR]: "BR",
    [BN]: "BN",
    [BP]: "BP"
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