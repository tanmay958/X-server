import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const prisma = new PrismaClient({ log: ["query", "error"] });
interface CreateTweetPayload {
  userid: number;
  content: string;
  imageUrl?: string;
}

const s3Client = new S3Client({
  region: "ap-south-1",
});
const queries = {
  getAllTweets: async () => {
    try {
      const data = await prisma.tweet.findMany({
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return data;
    } catch (err) {
      return err;
    }
  },
  getPreSignUrl: async (
    parent: any,
    { id, imageType }: { id: any; imageType: string }
  ) => {
    const typeSupported = ["image/jpeg", "image/jpg", "image/png"];
    if (!typeSupported.includes(imageType)) return null;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (user) {
      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        ContentType: imageType,
        Key: `upload/${id}/tweets-${Date.now()}`,
      });

      const signedURL = await getSignedUrl(s3Client, putObjectCommand);
      return signedURL;
    } else return null;
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
