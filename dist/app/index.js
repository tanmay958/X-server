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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGraphQl = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const Tweets_1 = require("./Tweets");
const User_1 = require("./User");
function initGraphQl() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        app.get("/", (req, res) => {
            res.status(200).json({ message: "healthy" });
        });
        const server = new server_1.ApolloServer({
            typeDefs: `
      ${User_1.User.types}
      ${Tweets_1.Tweet.types} 
      type Mutation {
        ${User_1.User.mutations}
        ${Tweets_1.Tweet.mutations} 
      }
      type Query {
        ${User_1.User.queries} 
        ${Tweets_1.Tweet.queries}
      }

    
     
    `,
            resolvers: {
                Mutation: Object.assign(Object.assign({}, User_1.User.resolvers.mutations), Tweets_1.Tweet.resolver.mutations),
                Query: Object.assign(Object.assign({}, User_1.User.resolvers.queries), Tweets_1.Tweet.resolver.queries),
            },
        });
        // Note you must call `start()` on the `ApolloServer`
        // instance before passing the instance to `expressMiddleware`
        yield server.start();
        // Specify the path where we'd like to mount our server
        //highlight-start
        app.use("/graphql", express_1.default.json(), (0, express4_1.expressMiddleware)(server));
        return app;
    });
}
exports.initGraphQl = initGraphQl;
//highlight-end
