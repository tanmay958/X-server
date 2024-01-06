import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import bodyParser, { BodyParser } from "body-parser";
import { Tweet } from "./Tweets";
import { User } from "./User";
export async function initGraphQl() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  const server = new ApolloServer({
    typeDefs: `
      ${User.types}
      ${Tweet.types} 
      type Mutation {
        ${User.mutations}
        ${Tweet.mutations} 
      }
      type Query {
        ${User.queries} 
        ${Tweet.queries}
      }

    
     
    `,
    resolvers: {
      Mutation: {
        ...User.resolvers.mutations,
        ...Tweet.resolver.mutations,
      },
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolver.queries,
      },
    },
  });
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await server.start();

  // Specify the path where we'd like to mount our server
  //highlight-start
  app.use("/graphql", express.json(), expressMiddleware(server));
  return app;
}
//highlight-end
