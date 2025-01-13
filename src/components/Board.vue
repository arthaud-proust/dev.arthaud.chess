<template>
  <div class="overflow-hidden relative aspect-square">
    <div
      class="aspect-square grid grid-cols-8 grid-rows-8"
    >
      <template v-for="col in COLS">
        <template v-for="row in ROWS">
          <BoardCase
            :color="caseColor({col, row})"
            :active="!!activePosition && areSamePositions(activePosition, {col: col-1, row: row-1})"
            :playable="!!activePosition && canPlay(snapshot, activePosition, { col: col-1, row: row-1 })"
            :occupied="pieceAt(snapshot.board, {col: col-1, row: row-1}) !== __"
            @click="emit('case:click', {col: col-1, row: row-1})"
          />
        </template>
      </template>
    </div>

    <div
      class="pointer-events-none absolute top-0 left-0 h-full w-full aspect-square grid grid-cols-8 grid-rows-8"
    >
      <template v-for="col in COLS">
        <template v-for="row in ROWS">
          <BoardPiece v-if="snapshot.board[col-1]?.[row-1]" :piece="snapshot.board[col-1][row-1]"
                      :style="{gridColumnStart: row, gridRowStart: col}"
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

defineProps<{
  snapshot: GameSnapshot
  activePosition?: Position
}>();

const emit = defineEmits<{
  "case:click": [Position]
}>();

const isEven = (x: number) => (x % 2) == 0;
const caseColor = ({ row, col }: Position) => {
  return (isEven(col) && isEven(row)) || (!isEven(col) && !isEven(row)) ? BLACK : WHITE;
};
</script>