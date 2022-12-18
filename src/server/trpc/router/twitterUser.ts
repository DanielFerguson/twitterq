import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const twitterUserRouter = router({
  get: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if this user exists
      let user = await ctx.prisma.twitterAccount.findUnique({
        where: { username: input.username },
        include: {
          questions: true,
        },
      });

      // If the user doesn't exist, fetch their data from Twitter and save them to the database
      if (!user) {
        const response = await fetch(
          `https://api.twitter.com/1.1/users/show.json?screen_name=${input.username}`,
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
          include: {
            questions: true,
          },
        });
      }

      // If the user still doesn't exist, return a 404 error
      if (!user) throw new Error("User not found");

      // Return the user
      return user;
    }),
  getOtherAccounts: publicProcedure
    .input(z.object({ notUser: z.string(), limit: z.number().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.twitterAccount.findMany({
        where: {
          username: {
            not: input.notUser,
          },
        },
        take: input.limit || 6,
      });
    }),
});
