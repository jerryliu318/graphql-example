
const graphqlHTTP = require('express-graphql');
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

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

const postType = require('../graphql/type/postType');
const authorType = require('../graphql/type/authorType');

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        posts: {
            type: new GraphQLList(postType.schemaObject),
            resolve: (parent, args, ctx) => ctx.posts
        },
        authors: {
            type: new GraphQLList(authorType.schemaObject),
            resolve: (parent, args, ctx) => ctx.authors
        },
        postById: {
            type: postType.schemaObject,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt),
                }
            },
            resolve: (parent, args, ctx) => ctx.posts.find(post => post.id === args.id)
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType
});

module.exports = app => {
    app.use('/schemaObject-2a', graphqlHTTP({
        schema: schema,
        context: { posts, authors },
        graphiql: true,
    }));
};