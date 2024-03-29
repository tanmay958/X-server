"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql
    input createTweetData{
        content  :  String!
        imageUrl :  String
        userid  :  Int!
    }
    type Tweet{
        id :  ID!
        content  :  String!
        imageUrl : String
        author  : User!
    }
    type PostResult {
        success :  Boolean 
        message : String
    }
`;
