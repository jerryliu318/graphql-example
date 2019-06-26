
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

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

const schema = `
    type Post {
        id: Int!
        title: String!
        votes: Int!
        authors: [Author]
    }

    type Author {
        id: Int!
        firstName: String!
        lastName: String!
        posts: [Post]
    }

    type Query {
        posts: [Post]
        authors: [Author]
        postById(id: Int!): Post
    }
`;

const resolvers = {
    Post: {
        authors: (parent, args, ctx) => parent.authorId.map(id => ctx.authors.find(author => author.id === id))
    },
    Author: {
        posts: (parent, args, ctx) => parent.postId.map(id => ctx.posts.find(post => post.id === id))
    },
    Query: {
        posts: (parent, args, ctx) => ctx.posts,
        authors: (parent, args, ctx) => ctx.authors,
        postById: (parent, args, ctx) => ctx.posts.find(post => post.id === args.id)
    }
};

// https://github.com/apollographql/graphql-tools
module.exports = app => {
    app.use('/SDL-2a', graphqlHTTP({
        schema: makeExecutableSchema({ typeDefs: schema, resolvers: resolvers }),
        context: { posts, authors },
        graphiql: true,
    }));
};
