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
    console.log(data);
    return data;
  },
};

const mutations = {
  // followUser: async (
  //   parent: any,
  //   { to }: { to: string },
  //   ctx: GraphqlContext
  // ) => {
  //   if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");

  //   await UserService.followUser(ctx.user.id, to);
  //   await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
  //   return true;
  // },
  // unfollowUser: async (
  //   parent: any,
  //   { to }: { to: string },
  //   ctx: GraphqlContext
  // ) => {
  //   if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");
  //   await UserService.unfollowUser(ctx.user.id, to);
  //   await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
  //   return true;
  // },
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
};
export const resolvers = { mutations, queries };
