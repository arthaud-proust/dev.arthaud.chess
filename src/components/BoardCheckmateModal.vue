<template>
  <Modal :model-value="isOpen" :closeable="false">
    <div class="flex flex-col items-center">
      <BoardPiece class="mb-2" :piece="currentPlayer === WHITE ? BK: WK" />
      <p class="mb-4 text-xl">{{ currentPlayer === WHITE ? "Black" : "White" }} has won !</p>

      <button @click="reloadPage" class="bg-neutral-100 rounded-md px-4 py-2">
        New game
      </button>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import { BK, type Color, WHITE, WK } from "@/core/rules.ts";
import BoardPiece from "@/components/BoardPiece.vue";

defineProps<{
  isOpen: boolean;
  currentPlayer: Color
}>();

const reloadPage = () => window.location.reload();
</script>