<template>
  <GamePlayer
    class="h-dvh"
    :snapshot="game.snapshot"
    @update:snapshot="saveSnapshot"
    v-model:horizontal="horizontal"
    v-model:rotate="rotate"
  />
</template>
<script setup lang="ts">
import { useIntervalFn, useStorage } from "@vueuse/core";
import { localStorageKey } from "@/utils/localStorage";
import GamePlayer from "@/components/GamePlayer.vue";
import type { StoredGame } from "#shared/types/game";
import { type GameSnapshot, initialGameSnapshot } from "@/core/rules";

const GLOBAL_GAME_ID = 0;

const game = ref({
  id: GLOBAL_GAME_ID,
  snapshot: initialGameSnapshot()
});

const fetchSnapshot = async () => await $fetch<StoredGame>(`/api/games/${GLOBAL_GAME_ID}`);

onMounted(async () => {
  game.value = await fetchSnapshot();
});

useIntervalFn(() => {
  fetchSnapshot().then((value => game.value = value));
}, 500);

const saveSnapshot = (snapshot: GameSnapshot) => {
  $fetch(`/api/games/${GLOBAL_GAME_ID}`, {
    method: "POST",
    body: snapshot
  });
};

const horizontal = useStorage(localStorageKey("ui.horizontal"), false);
const rotate = useStorage(localStorageKey("ui.rotate"), false);
</script>