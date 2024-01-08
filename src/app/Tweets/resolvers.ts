import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redisClient } from "../../Client/Redis";
const prisma = new PrismaClient();
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
      const cachedTweets = await redisClient.get("ALLTWEETS");
      if (cachedTweets) return JSON.parse(cachedTweets);
      const data = await prisma.tweet.findMany({
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      await redisClient.set("ALLTWEETS", JSON.stringify(data));
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
      const isExpired = await redisClient.get(`POST:${payload.userid}`);

      if (isExpired) {
        return {
          success: false,
          message: "only one post in 5s",
        };
      }
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
      await redisClient.del("ALLTWEETS");
      await redisClient.setex(`POST:${payload.userid}`, 10, 1);
      return {
        success: true,
        message: "posted successfully",
      };
    } catch (err: any) {
      return err;
    }
  },
};

export const resolver = { mutations, queries };
