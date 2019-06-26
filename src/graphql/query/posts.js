
const { GraphQLList } = require('graphql');
const postType = require('../type/postType');

module.exports = {
    schemaObject: {
        type: new GraphQLList(postType.schemaObject),
        resolve: (parent, args, ctx) => ctx.posts
    },
    SDLResolver: (parent, args, ctx) => ctx.posts
};