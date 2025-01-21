<template>
  <GamePlayer
    class="h-dvh"
    :initial-game-snapshot="game.snapshot.value"
    v-model:horizontal="horizontal"
    v-model:rotate="rotate"
    @game:reset="game.reset"
    @game:update="game.update"
  />
</template>
<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { localStorageKey } from "@/utils/localStorage";
import { useSavedSnapshot } from "@/composables/useSavedSnapshot";
import GamePlayer from "@/components/GamePlayer.vue";

const game = useSavedSnapshot();

const horizontal = useStorage(localStorageKey("ui.horizontal"), false);
const rotate = useStorage(localStorageKey("ui.rotate"), false);
</script>