import { useStorage } from "@vueuse/core";
import { copyOfGameSnapshot, type GameSnapshot, initialGameSnapshot } from "@/core/rules.ts";
import { localStorageKey } from "@/utils/localStorage.ts";
import { computed } from "vue";

export const useSavedSnapshot = () => {
  const savedSnapshot = useStorage<GameSnapshot>(localStorageKey("game.snapshot"), initialGameSnapshot());

  return {
    snapshot: computed(() => savedSnapshot.value),
    update: (snapshot: GameSnapshot) => savedSnapshot.value = copyOfGameSnapshot(snapshot),
    reset: () => {
      savedSnapshot.value = initialGameSnapshot();
      window.location.reload();
    }
  };
};