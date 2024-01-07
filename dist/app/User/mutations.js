"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    
    userSignIn(payload : userSingInPayload!) : ID! 
    follow(followerId : Int! , followingId : Int!) : FollowResponse!
    unfollow(followerId : Int! , followingId : Int!) : UnFollowResponse!
`;
