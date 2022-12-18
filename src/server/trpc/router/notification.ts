import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const notificationRouter = router({
  register: publicProcedure
    .input(z.object({ questionId: z.string(), emailAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Register the user to the database
      const notification = await ctx.prisma.notifications.create({
        data: {
          questionId: input.questionId,
          emailAddress: input.emailAddress,
        },
      });

      // Return the user
      return notification;
    }),
});
