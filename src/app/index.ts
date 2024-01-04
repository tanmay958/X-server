import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import bodyParser, { BodyParser } from "body-parser";

import { User } from "./User";
export async function initGraphQl() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  const server = new ApolloServer({
    typeDefs: `
      ${User.types}
      
      type Mutation {
        ${User.mutations}
      }
      type Query {
        ${User.queries} 
      }

    
     
    `,
    resolvers: {
      Mutation: {
        ...User.resolvers.mutations,
      },
      Query: {
        ...User.resolvers.queries,
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
