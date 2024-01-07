"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql
    input userSingInPayload {
        email :  String! 
        profileImage: String!
        firstName  :  String!
    }
    type User {
       id: ID!
       firstName : String!
       lastName :  String
       email : String!
       profileImageURL :  String
       Tweets : [Tweet]
    }
    type FollowResponse {
        success: Boolean!
        message: String!
      }

      type UnFollowResponse{
        success: Boolean!
        message: String!
      }
      type IsFollowing { 
        value :  Boolean! 
        message : String!
      }
      
      
`;
