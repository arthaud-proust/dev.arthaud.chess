<template>
  <div :style="{height: '100vmin', width: '100vmin'}" class="mx-auto flex flex-col items-center justify-center">
    <div class="w-fit p-4 h-full flex flex-col items-center gap-2 justify-center">
      <Board
        class="flex-1 aspect-square"
        :snapshot="game.snapshot"
        :activePosition="moveHandler.origin"
        :horizontal="horizontal"
        @case:click="handleClick"
      />

      <div class="flex gap-8 items-center">
        <label class="flex gap-2">
          <input type="checkbox" v-model="horizontal">
          <span>Horizontal</span>
        </label>
        <div v-if="game.snapshot.currentPlayer === WHITE" class="px-4 py-2 border">
          White to play
        </div>
        <div v-else class="px-4 py-2 bg-neutral-900 text-white border border-neutral-900">
          Black to play
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
import { type Piece, type Position, WHITE } from "@/core/rules.ts";
import { MoveHandler } from "@/core/moveHandler.ts";
import { reactive, ref } from "vue";
import BoardPromotionModal from "@/components/BoardPromotionModal.vue";
import BoardCheckmateModal from "@/components/BoardCheckmateModal.vue";
import BoardStalemateModal from "@/components/BoardStalemateModal.vue";

const game = reactive(new Game());
const isPromotionModalOpened = ref(false);
const isCheckmateModalOpened = ref(false);
const isStalemateModalOpened = ref(false);
const horizontal = ref(false);

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