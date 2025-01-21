import { useStorage } from "@vueuse/core";
import {
  copyOfGameSnapshot,
  type GameSnapshot,
  initialGameSnapshot,
} from "@/core/rules";
import { localStorageKey } from "@/utils/localStorage";
import { computed } from "vue";

export const useSavedSnapshot = () => {
  const savedSnapshot = useStorage<GameSnapshot>(
    localStorageKey("game.snapshot"),
    initialGameSnapshot(),
  );

  return {
    snapshot: computed(() => savedSnapshot.value),
    update: (snapshot: GameSnapshot) =>
      (savedSnapshot.value = copyOfGameSnapshot(snapshot)),
    reset: () => {
      savedSnapshot.value = initialGameSnapshot();
      window.location.reload();
    },
  };
};
