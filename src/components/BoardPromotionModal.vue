<template>
  <Modal :model-value="isOpen" :closeable="false">
    <div class="text-center">
      <p class="mb-4 text-xl">How do you promote your pawn ?</p>

      <div class="flex gap-4 items-center justify-center">
        <button v-for="piece in promotionPieces" @click="emit('promote', piece)" class="rounded-md overflow-hidden hover:bg-neutral-100">
          <BoardPiece :piece="piece" />
        </button>
      </div>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import { BB, BN, BQ, BR, type Color, type Piece, WB, WHITE, WN, WQ, WR } from "@/core/rules.ts";
import BoardPiece from "@/components/BoardPiece.vue";

const props = defineProps<{
  isOpen: boolean;
  currentPlayer: Color
}>();

const promotionPieces = [
  props.currentPlayer === WHITE ? WQ : BQ,
  props.currentPlayer === WHITE ? WR : BR,
  props.currentPlayer === WHITE ? WN : BN,
  props.currentPlayer === WHITE ? WB : BB
] as const;

const emit = defineEmits<{
  "promote": [Piece]
}>();
</script>