
const graphqlHTTP = require('express-graphql');
const {
    GraphQLObjectType,
    GraphQLSchema,
} = require('graphql');

const postsQuery = require('../graphql/query/posts');
const authorsQuery = require('../graphql/query/authors');
const postByIdQuery = require('../graphql/query/postById');

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

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        posts: postsQuery.schemaObject,
        authors: authorsQuery.schemaObject,
        postById: postByIdQuery.schemaObject
    }
});

const schema = new GraphQLSchema({
    query: queryType
});

module.exports = app => {
    app.use('/schemaObject-2b', graphqlHTTP({
        schema: schema,
        context: { posts, authors },
        graphiql: true,
    }));
};