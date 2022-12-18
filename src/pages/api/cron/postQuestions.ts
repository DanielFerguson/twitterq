import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { verifySignature } from "@upstash/qstash/nextjs";

const postQuestions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // TODO: Configure once Twitter as elevated the API
  // // Get all questions that haven't been asked yet
  // const unaskedQuestions = await prisma.question.findMany({
  //   where: {
  //     askedAt: null,
  //   },
  // });

  // // Post each question to the API
  // unaskedQuestions.forEach((question) => {
  //   // TODO: Post the question to the API
  //   // TODO: Update the question with the question ID and askedAt
  // });

  res.status(200);
};

export default verifySignature(postQuestions);

export const config = {
  api: {
    bodyParser: false,
  },
};
