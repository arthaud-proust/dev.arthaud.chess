import { findGame, GameNotFoundError } from "@/server/repos/games";
import { GameIdSchema } from "#shared/schemas/game";

export default defineEventHandler(async (event) => {
  const idResult = GameIdSchema.safeParse(getRouterParam(event, "id"));
  if (!idResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID should be an integer"
    });
  }

  try {
    return findGame(idResult.data);
  } catch (error) {
    if (error instanceof GameNotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: "Game not found"
      });
    }
  }
});