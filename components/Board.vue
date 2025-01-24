<template>
  <div
    class="overflow-hidden select-none rounded-sm md:rounded-md lg:rounded-lg relative aspect-square"
  >
    <div class="aspect-square grid grid-cols-8 grid-rows-8">
      <template v-for="{ col, row } in orientedPositions">
        <BoardCase
          :position="{ col, row }"
          :class="`case-${col}-${row}`"
          :color="caseColor({ col, row })"
          :selected="
            !!isMovingPiece &&
            !!activePosition &&
            !!hoveredPosition &&
            areSamePositions(hoveredPosition, { col, row })
          "
          :active="
            (!!activePosition &&
              areSamePositions(activePosition, { col, row })) ||
            areSamePositions(snapshot.lastMove.origin, { col, row }) ||
            areSamePositions(snapshot.lastMove.destination, { col, row })
          "
          :playable="
            !!activePosition && canPlay(snapshot, activePosition, { col, row })
          "
          :occupied="pieceAt(snapshot.board, { col, row }) !== __"
          @click="handleCaseClick({ col, row })"
        />
      </template>
    </div>

    <div
      class="pointer-events-none absolute top-0 left-0 h-full w-full aspect-square grid grid-cols-8 grid-rows-8"
      ref="container"
      @pointerup="placePiece"
      @touchend="placePiece"
    >
      <template v-for="{ col, row } in orientedPositions">
        <div :data-row="row" :data-col="col">
          <BoardPiece
            class="pointer-events-auto"
            @pointerdown="markAsActivePiece({ col, row })"
            v-if="snapshot.board[col]?.[row]"
            :piece="snapshot.board[col][row]"
            :style="
              isMovingPiece &&
              activePosition &&
              areSamePositions(activePosition, { col, row }) && {
                top: `${elementY}px`,
                left: `${elementX}px`,
                width: `12.5%`,
                transform: 'translate(-50%, -50%)',
              }
            "
            :class="[
              isMovingPiece &&
                activePosition &&
                areSamePositions(activePosition, { col, row }) &&
                'absolute',
            ]"
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  __,
  areSamePositions,
  BLACK,
  canPlay,
  type Color,
  COLS,
  type GameSnapshot,
  type Move,
  pieceAt,
  pieceColor,
  type Position,
  ROWS,
  WHITE
} from "@/core/rules";
import BoardCase from "@/components/BoardCase.vue";
import BoardPiece from "@/components/BoardPiece.vue";
import { computed, ref } from "vue";
import { useMouseInElement } from "@vueuse/core";
import { flipMatrixHorizontally, flipMatrixVertically, rotateMatrix90CounterClockwise } from "@/utils/matrix";

const props = withDefaults(
  defineProps<{
    snapshot: GameSnapshot;
    canMovePieces?: boolean;
    player?: Color;
    horizontal?: boolean;
    rotate?: boolean;
  }>(),
  {
    horizontal: false,
    rotate: false
  }
);
const emit = defineEmits<{
  "move": [Move];
}>();

const positionsMatrix = () => {
  const matrix: Position[][] = [];
  for (let row = 0; row < ROWS; row++) {
    const matrixRow = [];
    for (let col = 0; col < COLS; col++) {
      matrixRow.push({ col, row });
    }
    matrix.push(matrixRow);
  }

  return matrix;
};

const matrixToArray = <T, >(matrix: T[][]) => matrix.flatMap((row) => row);

const orientedPositions = computed(() => {
  let positions = positionsMatrix();

  if (props.horizontal) {
    positions = flipMatrixVertically(rotateMatrix90CounterClockwise(positions));
  } else {
    positions = flipMatrixVertically(positions);

    if (
      (props.rotate && props.snapshot.currentPlayer === BLACK)
      || (props.player && props.player === BLACK)
    ) {
      positions = flipMatrixVertically(flipMatrixHorizontally(positions));
    }
  }

  return matrixToArray(positions);
});

const container = ref<HTMLDivElement>();
const { x, y, elementX, elementY } = useMouseInElement(container);

const activePosition = ref<Position | null>(null);
const isMovingPiece = ref(false);

const markAsActivePiece = (position: Position) => {
  if (!props.canMovePieces) return;

  if (activePosition.value && pieceColor(pieceAt(props.snapshot.board, activePosition.value)) !== pieceColor(pieceAt(props.snapshot.board, position))) {
    emit("move", {
      origin: activePosition.value,
      destination: position
    });
    activePosition.value = null;

    return;
  }

  activePosition.value = position;
  isMovingPiece.value = true;
};

const hoveredPosition = computed(() => {
  const mousePosition = { x: x.value, y: y.value };

  const containerSize = container.value?.getBoundingClientRect().height;
  if (!containerSize) return;

  const elements = document.elementsFromPoint(mousePosition.x, mousePosition.y);
  const boardCase = elements.find((el) => {
    return el instanceof HTMLDivElement && el.dataset.type === "board-case";
  }) as HTMLDivElement | undefined;

  if (boardCase?.dataset.col && boardCase?.dataset.row)
    return {
      col: Number.parseInt(boardCase.dataset.col),
      row: Number.parseInt(boardCase.dataset.row)
    };
});

const handleCaseClick = (position: Position) => {
  if (!props.canMovePieces) return;
  if (!activePosition.value) return;

  emit("move", {
    origin: activePosition.value,
    destination: position
  });
  activePosition.value = null;
};

const placePiece = () => {
  if (!props.canMovePieces) return;
  isMovingPiece.value = false;

  const position = hoveredPosition.value;

  if (!position || !activePosition.value) return;
  if (areSamePositions(activePosition.value, position)) return;

  emit("move", {
    origin: activePosition.value,
    destination: position
  });
  activePosition.value = null;
};

const isEven = (x: number) => x % 2 == 0;
const caseColor = ({ row, col }: Position) => {
  return (isEven(col) && isEven(row)) || (!isEven(col) && !isEven(row))
    ? BLACK
    : WHITE;
};
</script>
