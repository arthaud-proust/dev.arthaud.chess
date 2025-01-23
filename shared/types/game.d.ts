import type { GameSnapshot } from "@/core/rules";

type StoredGame = {
  id: number;
  snapshot: GameSnapshot;
}