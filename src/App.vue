<template>
  <div class="w-full h-dvh flex items-center justify-center">
    <div :style="{height: '100vmin', width: '100vmin'}" class="mx-auto flex flex-col items-center justify-center p-2 md:p-4 lg:p-8">
      <div class="w-fit h-full flex flex-col items-center gap-4 justify-center">
        <Board
          class="flex-1 aspect-square"
          :snapshot="game.snapshot"
          :activePosition="moveHandler.origin"
          :horizontal="horizontal"
          :rotate="rotate"
          @case:click="handleClick"
        />

        <div class="flex gap-8 items-center">
          <label class="flex gap-2">
            <input type="checkbox" v-model="horizontal">
            <span>Horizontal</span>
          </label>
          <label v-if="!horizontal" class="flex gap-2">
            <input type="checkbox" v-model="rotate">
            <span>Rotate</span>
          </label>
          <div class=" flex items-center gap-1">
            <template v-if="game.snapshot.currentPlayer === WHITE">
              <BoardPiece :piece="WK" class="w-8" />
              <span>White to play</span>
            </template>
            <template v-else>
              <BoardPiece :piece="BK" class="w-8" />
              <span>Black to play</span>
            </template>
          </div>

          <button @click="savedSnapshot.reset()" class="bg-neutral-100 rounded-md px-4 py-2">
            Reset
          </button>
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