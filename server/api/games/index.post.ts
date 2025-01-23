import { createGame } from "@/server/repos/games";
import { GameSnapshotSchema } from "#shared/schemas/game";

export default defineEventHandler(async (event) => {
  const bodyResult = GameSnapshotSchema.safeParse(await readBody(event));
  if (!bodyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Body should be an a gameSnapshot"
    });
  }

  return createGame(bodyResult.data);
});