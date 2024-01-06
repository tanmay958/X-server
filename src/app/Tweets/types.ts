export const types = `#graphql
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
`;
