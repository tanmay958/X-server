export const queries = `#graphql
    verifyGoogleToken (token:String) : String
    getUserProfile (id : Int!) :  User 
    isFollowing (followerId : Int! , followingId : Int!) :  IsFollowing !
    getAllFollower(id :Int!)  : [User] 
    getAllFollowing(id:Int!) :  [User] 
    recommend(id :Int!)  :[User] 

`;
