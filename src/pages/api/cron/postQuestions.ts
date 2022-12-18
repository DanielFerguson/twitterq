import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { verifySignature } from "@upstash/qstash/nextjs";

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
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

    res.send("OK");
  } catch (err) {
    res.status(500).send(err);
  } finally {
    res.end();
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
