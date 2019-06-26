
const { GraphQLNonNull, GraphQLInt } = require('graphql');
const postType = require('../type/postType');

module.exports = {
    schemaObject: {
        type: postType.schemaObject,
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt),
            }
        },
        resolve: (parent, args, ctx) => ctx.posts.find(post => post.id === args.id)
    },
    SDLResolver: (parent, args, ctx) => ctx.posts.find(post => post.id === args.id)
};