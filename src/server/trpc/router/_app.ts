import { router } from "../trpc";
import { authRouter } from "./auth";
import { notificationRouter } from "./notification";
import { questionRouter } from "./question";
import { statRouter } from "./stat";
import { twitterUserRouter } from "./twitterUser";

export const appRouter = router({
  auth: authRouter,
  questions: questionRouter,
  twitterUsers: twitterUserRouter,
  stats: statRouter,
  notifications: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
