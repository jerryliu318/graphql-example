
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const authorType = require('../graphql/type/authorType');
const postType = require('../graphql/type/postType');

// example data
const posts = [
    { id: 1, title: 'Introduction to GraphQL', votes: 2, authorId: [ 1 ] },
    { id: 2, title: 'Welcome to Apollo', votes: 3, authorId: [ 1, 2 ] },
    { id: 3, title: 'Advanced GraphQL', votes: 1, authorId: [ 2 ] },
    { id: 4, title: 'Launchpad is Cool', votes: 7, authorId: [ 3 ] },
];
const authors = [
    { id: 1, firstName: 'Tom', lastName: 'Coleman', postId: [ 1, 2 ] },
    { id: 2, firstName: 'Sashko', lastName: 'Stubailo', postId: [ 2, 3 ] },
    { id: 3, firstName: 'Mikhail', lastName: 'Novikov', postId: [ 4 ] },
];

let schema = `
    type Query {
        posts: [Post]
        authors: [Author]
        postById(id: Int!): Post
    }
`;
schema += authorType.SDL.schema;
schema += postType.SDL.schema;

const resolvers = {
    Post: postType.SDL.resolver,
    Author: authorType.SDL.resolver,
    Query: {
        posts: (parent, args, ctx) => ctx.posts,
        authors: (parent, args, ctx) => ctx.authors,
        postById: (parent, args, ctx) => ctx.posts.find(post => post.id === args.id)
    }
};

// https://github.com/apollographql/graphql-tools
module.exports = app => {
    app.use('/SDL-2b', graphqlHTTP({
        schema: makeExecutableSchema({ typeDefs: schema, resolvers: resolvers }),
        context: { posts, authors },
        graphiql: true,
    }));
};
