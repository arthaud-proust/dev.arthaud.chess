<template>
  <Modal :model-value="isOpen" :closeable="false">
    <div class="flex flex-col items-center">
      <div class="flex mb-2">
        <BoardPiece :piece="WK" />
        <BoardPiece :piece="BK" />
      </div>
      <p class="mb-4 text-xl">Equality !</p>

      <button
        @click="savedSnapshot.reset()"
        class="bg-neutral-100 rounded-md px-4 py-2"
      >
        New game
      </button>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import { BK, WK } from "@/core/rules";
import BoardPiece from "@/components/BoardPiece.vue";
import { useSavedSnapshot } from "@/composables/useSavedSnapshot";

defineProps<{
  isOpen: boolean;
}>();

const savedSnapshot = useSavedSnapshot();
</script>
