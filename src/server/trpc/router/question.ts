import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const questionRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany({
      include: {
        recipent: true,
      },
    });
  }),
  ask: publicProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Extract the @ twitter handle from the input
      const handle = input.question.match(/@(\w+)/)?.[1];

      // TODO: Move the following code into a library to reduce duplication
      // TODO: across the codebase

      // Check if this user exists
      let user = await ctx.prisma.twitterAccount.findUnique({
        where: { username: handle },
      });

      // If the user doesn't exist, fetch their data from Twitter and save them to the database
      if (!user) {
        const response = await fetch(
          `https://api.twitter.com/1.1/users/show.json?screen_name=${handle}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            },
          }
        );

        const data = await response.json();

        user = await ctx.prisma.twitterAccount.create({
          data: {
            id: data.id_str,
            username: data.screen_name,
            friendlyName: data.name,
            description: data.description,
            profileImageUrl: data.profile_image_url_https,
          },
        });
      }

      if (!user) throw new Error("User not found");

      // Save the question to the database
      const question = ctx.prisma.question.create({
        data: {
          content: input.question,
          twitterAccountId: user.id,
        },
      });

      return question;
    }),
});
