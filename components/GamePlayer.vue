<template>
  <div
    class="w-full overflow-hidden p-2 md:p-4 lg:p-8 flex flex-col items-center gap-4 justify-end"
  >
    <div class="relative flex-1 max-md:w-full md:w-fit flex flex-col justify-center items-center gap-2">
      <Board
        class="max-md:w-full md:h-full aspect-square w-auto"
        :snapshot="game.snapshot"
        :horizontal="horizontal"
        :rotate="rotate"
        @move="handleMove"
      />

      <div class="w-full flex gap-8 justify-between h-6 md:px-4">
        <div class="flex items-center">
          <BoardPiece
            v-for="piece in game.eatenBlackPieces"
            :piece="piece"
            class="h-full -mr-2"
          />
          <span
            v-if="game.blackPoints"
            class="ml-2 text-sm text-neutral-500 font-medium"
          >+{{ game.blackPoints }}</span
          >
        </div>

        <div class="flex items-center">
          <span
            v-if="game.whitePoints"
            class="mr-2 text-sm text-neutral-500 font-medium"
          >
            +{{ game.whitePoints }}
          </span>

          <div class="flex items-center -gap-4 h-full">
            <BoardPiece
              v-for="piece in game.eatenWhitePieces"
              :piece="piece"
              class="h-full -ml-2"
            />
          </div>

        </div>
      </div>
    </div>

    <div
      class="flex max-md:text-sm flex-wrap gap-x-8 gap-y-4 items-center select-none"
    >
      <div class="flex items-center gap-1">
        <template v-if="game.snapshot.currentPlayer === WHITE">
          <BoardPiece :piece="WK" class="w-8" />
          <span>White to play</span>
        </template>
        <template v-else>
          <BoardPiece :piece="BK" class="w-8" />
          <span>Black to play</span>
        </template>
      </div>

      <div class="flex flex-wrap gap-2 items-center">
        <label
          v-tooltip="'Display board horizontally'"
          class="flex gap-2 bg-neutral-100 rounded-md px-4 py-2"
        >
          <input type="checkbox" v-model="horizontal" />
          <span>Horizontal</span>
        </label>
        <label
          v-if="!horizontal"
          v-tooltip="'Rotate board for the current player'"
          class="flex gap-2 bg-neutral-100 rounded-md px-4 py-2"
        >
          <input type="checkbox" v-model="rotate" />
          <span>Rotate</span>
        </label>

        <button
          @click="game.undo()"
          v-if="game.canUndo"
          v-tooltip="'Undo last move'"
          class="bg-neutral-100 rounded-md px-4 py-2"
        >
          Undo
        </button>

        <button
          @click="game.reset()"
          v-tooltip="'Reset board for a new game'"
          class="bg-red-100 text-red-800 rounded-md px-4 py-2"
        >
          New game
        </button>
      </div>
    </div>

    <BoardPromotionModal
      :is-open="!!promotingPosition"
      :current-player="game.currentPlayer"
      @promote="handlePromotion"
    />
    <BoardCheckmateModal
      :is-open="isCheckmateModalOpened"
      :current-player="game.currentPlayer"
    />
    <BoardStalemateModal :is-open="isStalemateModalOpened" />
  </div>
</template>
<script setup lang="ts">
import Board from "@/components/Board.vue";
import { Game } from "@/core/game";
import { BK, type GameSnapshot, InvalidMoveError, InvalidPromotionError, type Move, type Piece, type Position, WHITE, WK } from "@/core/rules";
import { reactive, ref, watch } from "vue";
import BoardPromotionModal from "@/components/BoardPromotionModal.vue";
import BoardCheckmateModal from "@/components/BoardCheckmateModal.vue";
import BoardStalemateModal from "@/components/BoardStalemateModal.vue";
import BoardPiece from "@/components/BoardPiece.vue";

const props = defineProps<{
  snapshot: GameSnapshot
}>();

const horizontal = defineModel<boolean>("horizontal", {
  required: true
});

const rotate = defineModel<boolean>("rotate", {
  required: true
});

const emit = defineEmits<{
  "update:snapshot": [GameSnapshot]
}>();

const game = reactive(new Game(props.snapshot));
watch(() => props.snapshot, (newValue) => game.update(newValue));

const promotingPosition = ref<Position | null>(null);
const isCheckmateModalOpened = ref(false);
const isStalemateModalOpened = ref(false);

const handleMove = (move: Move) => {
  try {
    game.play(move);

    emit("update:snapshot", game.snapshot);

    if (game.canPromote(move.destination)) {
      promotingPosition.value = move.destination;
      return;
    }

    if (game.isCurrentPlayerCheckmated) {
      isCheckmateModalOpened.value = true;
      return;
    }

    if (game.isCurrentPlayerStalemated) {
      isStalemateModalOpened.value = true;
      return;
    }
  } catch (e) {
    if (!(e instanceof InvalidMoveError)) {
      console.error(e);
    }
  }
};

const handlePromotion = (piece: Piece) => {
  if (!promotingPosition.value) return;

  try {
    game.promoteTo(promotingPosition.value, piece);

    emit("update:snapshot", game.snapshot);

    promotingPosition.value = null;
  } catch (e) {
    if (!(e instanceof InvalidPromotionError)) {
      console.error(e);
    }
  }
};
</script>
