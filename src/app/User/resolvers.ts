import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const queries = {
  verifyGoogleToken: (token: any) => {
    return token;
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
  userSignIn: async (parent: any, { email }: any) => {
    try {
      console.log(email);
      const getUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log("--", getUser);
      if (getUser) {
        return getUser.id;
      } else {
        const user = await prisma.user.create({
          data: {
            email: email,
          },
        });
        console.log(user);
        return user.id;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
export const resolvers = { mutations, queries };
