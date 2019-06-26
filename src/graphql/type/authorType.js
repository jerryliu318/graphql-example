
const {
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql');

const schemaObject = new GraphQLObjectType({
    name: 'author',
    fields: () => {
        const postType = require('./postType');

        return {
            id: {
                type: new GraphQLNonNull(GraphQLID)
            },
            firstName: {
                type: new GraphQLNonNull(GraphQLString)
            },
            lastName: {
                type: new GraphQLNonNull(GraphQLString)
            },
            posts: {
                type: new GraphQLList(postType.schemaObject),
                resolve: (parent, args, ctx) => parent.postId.map(id => ctx.posts.find(post => post.id === id))
            }
        };
    }
});

const SDL = {
    schema: `
        type Author {
            id: Int!
            firstName: String!
            lastName: String!
            posts: [Post]
        }
    `,
    resolver: {
        posts: (parent, args, ctx) => parent.postId.map(id => ctx.posts.find(post => post.id === id))
    }
};

module.exports = {
    schemaObject: schemaObject,
    SDL: SDL
};