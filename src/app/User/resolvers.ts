import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const queries = {
  getUserProfile: async (parent: any, { id }: any) => {
    console.log("it is called-->");
    const data = await prisma.user.findUnique({
      where: { id: id },
      include: {
        Tweets: true,
      },
    });
    return data;
  },
  isFollowing: async (
    parent: any,
    { followerId, followingId }: { followerId: any; followingId: any }
  ) => {
    const data = await prisma.follows.findUnique({
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
  },
  getAllFollower: async (parent: any, { id }: { id: any }) => {
    const data = await prisma.follows.findMany({
      where: {
        followingId: id,
      },
      include: {
        follower: true,
      },
    });
    const followers: any = [];
    data.map((item: any) => {
      followers.push(item.follower);
    });
    return followers;
  },
  getAllFollowing: async (parent: any, { id }: { id: any }) => {
    const data = await prisma.follows.findMany({
      where: {
        followerId: id,
      },
      include: {
        following: true,
      },
    });
    const followings: any = [];
    data.map((item: any) => {
      followings.push(item.following);
    });
    return followings;
  },
};

const mutations = {
  userSignIn: async (parent: any, { payload }: any) => {
    try {
      const getUser = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (getUser) {
        return getUser.id;
      } else {
        const user = await prisma.user.create({
          data: {
            email: payload.email,
            firstName: payload.firstName,
            profileImageURL: payload.profileImage,
          },
        });
        console.log(user);
        return user.id;
      }
    } catch (err) {
      console.log("yes error catced in the resolver block");
      console.log(err);
    }
  },

  follow: async (
    parent: any,
    { followerId, followingId }: { followerId: any; followingId: any }
  ) => {
    try {
      const newFollow = await prisma.follows.create({
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
  },
  unfollow: async (
    parent: any,
    { followerId, followingId }: { followerId: any; followingId: any }
  ) => {
    try {
      const isFollowing = await prisma.follows.findUnique({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      });
      if (isFollowing) {
        await prisma.follows.delete({
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
  },
};
export const resolvers = { mutations, queries };
