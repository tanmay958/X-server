"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const client_1 = require("@prisma/client");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const Redis_1 = require("../../Client/Redis");
const prisma = new client_1.PrismaClient();
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_DEFAULT_REGION,
});
const queries = {
    getAllTweets: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cachedTweets = yield Redis_1.redisClient.get("ALLTWEETS");
            if (cachedTweets)
                return JSON.parse(cachedTweets);
            const data = yield prisma.tweet.findMany({
                include: {
                    author: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            yield Redis_1.redisClient.set("ALLTWEETS", JSON.stringify(data));
            return data;
        }
        catch (err) {
            return err;
        }
    }),
    getPreSignUrl: (parent, { id, imageType }) => __awaiter(void 0, void 0, void 0, function* () {
        const typeSupported = ["image/jpeg", "image/jpg", "image/png"];
        if (!typeSupported.includes(imageType))
            return null;
        const user = yield prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (user) {
            const putObjectCommand = new client_s3_1.PutObjectCommand({
                Bucket: process.env.BUCKET,
                ContentType: imageType,
                Key: `upload/${id}/tweets-${Date.now()}`,
            });
            const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
            return signedURL;
        }
        else
            return null;
    }),
};
const mutations = {
    createTweet: (parent, { payload }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isExpired = yield Redis_1.redisClient.get(`POST:${payload.userid}`);
            if (isExpired) {
                return {
                    success: false,
                    message: "only one post in 5s",
                };
            }
            const tweet = yield prisma.tweet.create({
                data: {
                    content: payload.content,
                    imageUrl: payload === null || payload === void 0 ? void 0 : payload.imageUrl,
                    authorId: payload.userid,
                },
                include: {
                    author: true, // Make sure to include the author field
                },
            });
            yield Redis_1.redisClient.del("ALLTWEETS");
            yield Redis_1.redisClient.setex(`POST:${payload.userid}`, 10, 1);
            return {
                success: true,
                message: "posted successfully",
            };
        }
        catch (err) {
            return err;
        }
    }),
};
exports.resolver = { mutations, queries };
