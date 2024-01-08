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
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const queries = {
    getUserProfile: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("it is called-->");
        const data = yield prisma.user.findUnique({
            where: { id: id },
            include: {
                Tweets: true,
            },
        });
        return data;
    }),
    isFollowing: (parent, { followerId, followingId }) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.follows.findUnique({
            where: {
                followerId_followingId: { followerId, followingId },
            },
        });
        if (data) {
            return {
                value: true,
                message: "yes",
            };
        }
        else
            return {
                value: false,
                message: "no",
            };
    }),
    getAllFollower: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.follows.findMany({
            where: {
                followingId: id,
            },
            include: {
                follower: true,
            },
        });
        const followers = [];
        data.map((item) => {
            followers.push(item.follower);
        });
        return followers;
    }),
    getAllFollowing: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield prisma.follows.findMany({
            where: {
                followerId: id,
            },
            include: {
                following: true,
            },
        });
        const followings = [];
        data.map((item) => {
            followings.push(item.following);
        });
        return followings;
    }),
    recommend: (parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
        const followingIds = yield prisma.follows.findMany({
            where: {
                followerId: id,
            },
            select: {
                followingId: true,
            },
        });
        const recommendedUser = yield prisma.follows.findMany({
            where: {
                followerId: {
                    in: followingIds.map((item) => item.followingId),
                },
            },
            include: {
                following: true,
            },
            distinct: ["followingId"],
        });
        const recommendation = [];
        recommendedUser.map((item) => {
            if (!followingIds.includes(item.following.id) &&
                item.following.id != id) {
                recommendation.push(item.following);
            }
        });
        return recommendation;
    }),
};
const mutations = {
    userSignIn: (parent, { payload }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const getUser = yield prisma.user.findUnique({
                where: {
                    email: payload.email,
                },
            });
            if (getUser) {
                return getUser.id;
            }
            else {
                const user = yield prisma.user.create({
                    data: {
                        email: payload.email,
                        firstName: payload.firstName,
                        profileImageURL: payload.profileImage,
                    },
                });
                console.log(user);
                return user.id;
            }
        }
        catch (err) {
            console.log("yes error catced in the resolver block");
            console.log(err);
        }
    }),
    follow: (parent, { followerId, followingId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newFollow = yield prisma.follows.create({
                data: {
                    followerId,
                    followingId,
                },
            });
            if (newFollow) {
                return {
                    success: true,
                    message: "followed successfully",
                };
            }
            else
                return {
                    success: false,
                    message: newFollow,
                };
        }
        catch (err) {
            return {
                success: false,
                message: err,
            };
        }
    }),
    unfollow: (parent, { followerId, followingId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isFollowing = yield prisma.follows.findUnique({
                where: {
                    followerId_followingId: { followerId, followingId },
                },
            });
            if (isFollowing) {
                yield prisma.follows.delete({
                    where: {
                        followerId_followingId: { followerId, followingId },
                    },
                });
                return {
                    success: true,
                    message: "sucessfully unfollowed",
                };
            }
            else {
                return {
                    success: false,
                    message: "you are not following him",
                };
            }
        }
        catch (err) {
            return {
                success: false,
                message: err,
            };
        }
    }),
};
exports.resolvers = { mutations, queries };
