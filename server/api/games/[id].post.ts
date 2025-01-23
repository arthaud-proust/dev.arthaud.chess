import { updateOrCreateGame } from "@/server/repos/games";
import { GameIdSchema, GameSnapshotSchema } from "#shared/schemas/game";

export default defineEventHandler(async (event) => {
  const idResult = GameIdSchema.safeParse(getRouterParam(event, "id"));
  if (!idResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID should be an integer"
    });
  }

  const bodyResult = GameSnapshotSchema.safeParse(await readBody(event));
  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Body should be an a gameSnapshot"
    });
  }

  return updateOrCreateGame(idResult.data, bodyResult.data);
});