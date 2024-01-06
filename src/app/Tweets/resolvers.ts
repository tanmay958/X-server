import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "error"] });
interface CreateTweetPayload {
  userid: number;
  content: string;
  imageUrl?: string;
}

const queries = {
  getAllTweets: async () => {
    try {
      const data = await prisma.tweet.findMany({
        include: {
          author: true,
        },
      });
      return data;
    } catch (err) {
      return err;
    }
  },
};
const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload }
  ) => {
    try {
      const tweet = await prisma.tweet.create({
        data: {
          content: payload.content,
          imageUrl: payload?.imageUrl,
          authorId: payload.userid,
        },
        include: {
          author: true, // Make sure to include the author field
        },
      });
      return tweet;
    } catch (err: any) {
      return err;
    }
  },
};

export const resolver = { mutations, queries };
