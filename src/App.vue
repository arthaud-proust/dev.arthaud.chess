<template>
  <div class="w-full h-dvh flex items-center justify-center">
    <div class="w-full max-w-3xl p-2 md:p-4 lg:p-8 h-full flex flex-col items-center gap-4 justify-center">
      <Board
        class="aspect-square w-full"
        :snapshot="game.snapshot"
        :activePosition="moveHandler.origin"
        :horizontal="horizontal"
        :rotate="rotate"
        @case:click="handleClick"
      />

      <div class="w-full flex gap-8 justify-between h-6">
        <div class="flex items-center">
          <span v-if="game.blackPoints" class="mr-2 text-sm text-neutral-500 font-medium">+{{ game.blackPoints }}</span>
          <BoardPiece
            v-for="piece in game.eatenBlackPieces" :piece="piece"
            class="h-full -mr-2"
          />
        </div>

        <div class="flex items-center">
          <div class="flex items-center -gap-4 h-full">
            <BoardPiece
              v-for="piece in game.eatenWhitePieces" :piece="piece"
              class="h-full -ml-2"
            />
          </div>
          <span v-if="game.whitePoints" class="ml-2 text-sm text-neutral-500 font-medium">+{{ game.whitePoints }}</span>
        </div>
      </div>

      <div class="flex max-md:text-sm flex-wrap gap-x-8 gap-y-4 items-center select-none">
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

        <div class="flex gap-2 items-center">
          <label v-tooltip="'Display board horizontally'" class="flex gap-2 bg-neutral-100 rounded-md px-4 py-2">
            <input type="checkbox" v-model="horizontal">
            <span>Horizontal</span>
          </label>
          <label v-if="!horizontal" v-tooltip="'Rotate board for the current player'" class="flex gap-2 bg-neutral-100 rounded-md px-4 py-2">
            <input type="checkbox" v-model="rotate">
            <span>Rotate</span>
          </label>

          <button @click="game.undo()" v-if="game.canUndo" v-tooltip="'Undo last move'" class="bg-neutral-100 rounded-md px-4 py-2">
            Undo
          </button>

          <button @click="savedSnapshot.reset()" v-tooltip="'Reset board for a new game'" class="bg-red-100 text-red-800 rounded-md px-4 py-2">
            New game
          </button>
        </div>
      </div>
    </div>

    <BoardPromotionModal
      :is-open="isPromotionModalOpened"
      :current-player="game.currentPlayer"
      @promote="handlePromotion"
    />
    <BoardCheckmateModal
      :is-open="isCheckmateModalOpened"
      :current-player="game.currentPlayer"
    />
    <BoardStalemateModal
      :is-open="isStalemateModalOpened"
    />
  </div>
</template>
<script setup lang="ts">
import Board from "@/components/Board.vue";
import { Game } from "@/core/game.ts";
import { BK, copyOfGameSnapshot, type Piece, type Position, WHITE, WK } from "@/core/rules.ts";
import { MoveHandler } from "@/core/moveHandler.ts";
import { reactive, ref, watch } from "vue";
import BoardPromotionModal from "@/components/BoardPromotionModal.vue";
import BoardCheckmateModal from "@/components/BoardCheckmateModal.vue";
import BoardStalemateModal from "@/components/BoardStalemateModal.vue";
import BoardPiece from "@/components/BoardPiece.vue";
import { useStorage } from "@vueuse/core";
import { localStorageKey } from "@/utils/localStorage.ts";
import { useSavedSnapshot } from "@/composables/useSavedSnapshot.ts";

const savedSnapshot = useSavedSnapshot();
const horizontal = useStorage(localStorageKey("ui.horizontal"), false);
const rotate = useStorage(localStorageKey("ui.rotate"), false);
const game = reactive(new Game(copyOfGameSnapshot(savedSnapshot.snapshot.value)));
const isPromotionModalOpened = ref(false);
const isCheckmateModalOpened = ref(false);
const isStalemateModalOpened = ref(false);

watch(() => game.snapshot, savedSnapshot.update);

const handleClick = (position: Position) => {
  moveHandler.register(game.snapshot, position);
};

const handlePromotion = (piece: Piece) => {
  if (!moveHandler.destination) return;

  try {
    game.promoteTo(moveHandler.destination, piece);
    isPromotionModalOpened.value = false;
    moveHandler.reset();

  } catch (e) {
    moveHandler.reset();
  }
};

const moveHandler = reactive(new MoveHandler((move) => {
  try {
    game.play(move);

    if (game.canPromote(move.destination)) {
      isPromotionModalOpened.value = true;
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

    moveHandler.reset();
  } catch (e) {
    moveHandler.reset();
  }
}));
</script>