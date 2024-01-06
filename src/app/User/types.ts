export const types = `#graphql
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
`;
