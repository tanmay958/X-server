export const mutations = `#graphql
    
    userSignIn(payload : userSingInPayload!) : ID! 
    follow(followerId : Int! , followingId : Int!) : FollowResponse!
    unfollow(followerId : Int! , followingId : Int!) : UnFollowResponse!
`;
