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
    verifyGoogleToken: (token) => {
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
    userSignIn: (parent, { email }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(email);
            const getUser = yield prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            console.log("--", getUser);
            if (getUser) {
                return getUser.id;
            }
            else {
                const user = yield prisma.user.create({
                    data: {
                        email: email,
                    },
                });
                console.log(user);
                return user.id;
            }
        }
        catch (err) {
            console.log(err);
        }
    }),
};
exports.resolvers = { mutations, queries };
