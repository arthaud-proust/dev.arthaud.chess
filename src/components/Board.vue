<template>
  <div class="overflow-hidden relative aspect-square" :class="horizontal || (snapshot.currentPlayer === WHITE ?'-rotate-90': 'rotate-90')">
    <div
      class="aspect-square grid grid-cols-8 grid-rows-8"
    >
      <template v-for="col in Array(COLS).keys()">
        <template v-for="row in Array(ROWS).keys()">
          <BoardCase
            :class="`case-${col}-${row}`"
            :color="caseColor({col, row})"
            :active="!!activePosition && areSamePositions(activePosition, {col, row})"
            :playable="!!activePosition && canPlay(snapshot, activePosition, { col, row })"
            :occupied="pieceAt(snapshot.board, {col, row}) !== __"
            @click="emit('case:click', {col, row})"
          />
        </template>
      </template>
    </div>

    <div
      class="pointer-events-none absolute top-0 left-0 h-full w-full aspect-square grid grid-cols-8 grid-rows-8"
    >
      <template v-for="col in COLS">
        <template v-for="row in ROWS">
          <BoardPiece
            v-if="snapshot.board[col-1]?.[row-1]"
            :piece="snapshot.board[col-1][row-1]"
            :style="{gridColumnStart: row, gridRowStart: col}"
            :class="horizontal || (snapshot.currentPlayer === WHITE ?'rotate-90': '-rotate-90')"
          />
        </template>
      </template>
    </div>
  </div>

</template>
<script setup lang="ts">
import { __, areSamePositions, BLACK, canPlay, COLS, type GameSnapshot, pieceAt, type Position, ROWS, WHITE } from "@/core/rules.ts";
import BoardCase from "@/components/BoardCase.vue";
import BoardPiece from "@/components/BoardPiece.vue";

withDefaults(
  defineProps<{
    snapshot: GameSnapshot
    activePosition?: Position
    horizontal?: boolean
  }>(),
  {
    horizontal: false
  }
);

const emit = defineEmits<{
  "case:click": [Position]
}>();

const isEven = (x: number) => (x % 2) == 0;
const caseColor = ({ row, col }: Position) => {
  return (isEven(col) && isEven(row)) || (!isEven(col) && !isEven(row)) ? BLACK : WHITE;
};
</script>