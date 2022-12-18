import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { verifySignature } from "@upstash/qstash/nextjs";

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // TODO: Configure once Twitter as elevated the API
    //   // Get all questions that haven't been answered
    //   const questions = await prisma.question.findMany({
    //     where: {
    //       answer: null,
    //     },
    //   });

    //   // TODO: For each question, check if there's a reply
    //   questions.forEach((question) => {
    //     // TODO: Check if there's a reply from the questions intended recipient
    //     // TODO: If there's a reply...
    //     // - update the question with the answer,
    //     // - set answeredAt to now, and
    //     // - email all users who have subscribed to the question
    //   });

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
