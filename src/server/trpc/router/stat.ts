import { z } from "zod";

import { router, publicProcedure } from "../trpc";

interface Statistics {
  questionsAsked: number;
  questionsAnswered: number;
  averageResponseTime: number;
}

export const statRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Return the number of questions asked, and the number of questions answered and the average response time for each question (in days)
    const response = await ctx.prisma.$queryRaw<Statistics[]>`
      SELECT
        (SELECT COUNT(*) FROM Question) AS "questionsAsked",
        (SELECT COUNT(*) FROM Question WHERE answeredAt IS NOT NULL) AS "questionsAnswered",
        (SELECT AVG(TIME_TO_SEC(TIMEDIFF(askedAt, answeredAt))) FROM Question WHERE "answeredAt" IS NOT NULL) AS "averageResponseTime"
      FROM
          Question
      LIMIT 1
    `;

    return response[0];
  }),
  getForUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get the username from the input, remove the @ if it exists
      const username = input.username.replace("@", "");

      // Return the number of questions asked, and the number of questions answered and the average response time for each question (in days) for the given user
      const response = await ctx.prisma.$queryRaw<Statistics[]>`
        SELECT
          (SELECT COUNT(*) FROM Question WHERE twitterAccountId = (SELECT id FROM TwitterAccount WHERE username = ${username})) AS "questionsAsked",
          (SELECT COUNT(*) FROM Question WHERE twitterAccountId = (SELECT id FROM TwitterAccount WHERE username = ${username}) AND answeredAt IS NOT NULL) AS "questionsAnswered",
          (SELECT AVG(TIME_TO_SEC(TIMEDIFF(askedAt, answeredAt))) FROM Question WHERE twitterAccountId = (SELECT id FROM TwitterAccount WHERE username = ${username}) AND answeredAt IS NOT NULL) AS "averageResponseTime"
        FROM
            Question
        LIMIT 1
      `;

      return response[0];
    }),
});
