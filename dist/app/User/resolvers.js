"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const Redis_1 = require("../../Client/Redis");
const prisma = new client_1.PrismaClient();
const queries = {
  getUserProfile: (parent, { id }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const data = yield prisma.user.findUnique({
        where: { id: id },
        include: {
          Tweets: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      return data;
    }),
  isFollowing: (parent, { followerId, followingId }) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
      } else
        return {
          value: false,
          message: "no",
        };
    }),
  getAllFollower: (parent, { id }) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
  getAllFollowing: (parent, { id }) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
  recommend: (parent, { id }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const cache = yield Redis_1.redisClient.get(`recommend:${id}`);
      if (cache) return JSON.parse(cache);
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
      const numeric_FollowingsId = [];
      followingIds.map((item) => {
        numeric_FollowingsId.push(item.followingId);
      });
      const recommendation = [];
      recommendedUser.map((item) => {
        if (
          !numeric_FollowingsId.includes(item.following.id) &&
          item.following.id != id
        ) {
          recommendation.push(item.following);
        }
      });
      const dummydata = [
        {
          email: "tanmay.nitt@gmail.com",
          profileImageURL:
            "https://avatars.githubusercontent.com/u/29747452?v=4",
          id: "1",
          firstName: "sanket singh",
        },
        {
          email: "harkiratsingh@gmail.com",
          profileImageURL:
            "https://avatars.githubusercontent.com/u/8079861?v=4",
          id: "2",
          firstName: "Harkirat Singh",
        },
        {
          email: "hussain.naseer@gmail.com",
          profileImageURL:
            "https://avatars.githubusercontent.com/u/3898305?v=4",
          id: "3",
          firstName: "Hussein Nasser",
        },
      ];
      for (let i = 0; i < dummydata.length; i++)
        recommendation.push(dummydata[i]);
      yield Redis_1.redisClient.set(
        `recommend:${id}`,
        JSON.stringify(recommendation)
      );
      return recommendation;
    }),
};
const mutations = {
  userSignIn: (parent, { payload }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const getUser = yield prisma.user.findUnique({
          where: {
            email: payload.email,
          },
        });
        if (getUser) {
          return getUser.id;
        } else {
          const user = yield prisma.user.create({
            data: {
              email: payload.email,
              firstName: payload.firstName,
              profileImageURL: payload.profileImage,
            },
          });

          return user.id;
        }
      } catch (err) {}
    }),
  follow: (parent, { followerId, followingId }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const newFollow = yield prisma.follows.create({
          data: {
            followerId,
            followingId,
          },
        });
        if (newFollow) {
          yield Redis_1.redisClient.del(`recommend:${followerId}`);
          return {
            success: true,
            message: "followed successfully",
          };
        } else
          return {
            success: false,
            message: newFollow,
          };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    }),
  unfollow: (parent, { followerId, followingId }) =>
    __awaiter(void 0, void 0, void 0, function* () {
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
        } else {
          return {
            success: false,
            message: "you are not following him",
          };
        }
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    }),
};
exports.resolvers = { mutations, queries };
