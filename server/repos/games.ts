import { JSONFileSyncPreset } from "lowdb/node";
import { type GameSnapshot } from "@/core/rules";
import { StoredGame } from "#shared/types/game";


const GAMES_FILEPATH = "./storage/games.json";

export class GameNotFoundError extends Error {
}

const db = JSONFileSyncPreset<Array<StoredGame>>(
  GAMES_FILEPATH,
  []
);

export const findGame = (id: number) => {
  const game = db.data.find((game) => game.id === id);
  if (!game) throw new GameNotFoundError("game not found");

  return game;
};

export const updateGame = (id: number, snapshot: GameSnapshot) => {
  const game = findGame(id);

  game.snapshot = snapshot;

  db.write();

  return game;
};


export const createGame = (snapshot: GameSnapshot) => {
  const lastGame = db.data.slice(-1)[0];
  const id = (lastGame?.id ?? -1) + 1;

  const game = {
    id,
    snapshot
  };

  db.data.push(game);
  db.write();

  return game;
};

export const updateOrCreateGame = (id: number, snapshot: GameSnapshot) => {
  try {
    return updateGame(id, snapshot);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      return createGame(snapshot);
    }
  }
};