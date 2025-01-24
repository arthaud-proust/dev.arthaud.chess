<template>
  <Head>
    <title>Chess</title>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Chess" />
    <link rel="manifest" href="/site.webmanifest" />
  </Head>
  <GamePlayer
    class="h-dvh"
    :player="player"
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
import { type Color, type GameSnapshot, initialGameSnapshot } from "@/core/rules";

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

const player = useStorage<Color>(localStorageKey("game.player"), game.value.snapshot.currentPlayer);
const horizontal = useStorage(localStorageKey("ui.horizontal"), false);
const rotate = useStorage(localStorageKey("ui.rotate"), false);
</script>