
const graphqlHTTP = require('express-graphql');
const {
    GraphQLID,
    GraphQLString,
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

const postType = new GraphQLObjectType({
    name: 'post',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        votes: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        authors: {
            type: new GraphQLList(authorType),
            resolve: (parent, args, ctx) => parent.authorId.map(id => ctx.authors.find(author => author.id === id))
        },
    })
});

const authorType = new GraphQLObjectType({
    name: 'author',
    fields: () => ({
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
            type: new GraphQLList(postType),
            resolve: (parent, args, ctx) => parent.postId.map(id => ctx.posts.find(post => post.id === id))
        }
    })
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        posts: {
            type: new GraphQLList(postType),
        },
        authors: {
            type: new GraphQLList(authorType),
        },
        postById: {
            type: postType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt),
                }
            },
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType
});

console.log('run schemaObject-1', schema);

const root = {
    posts: (args, ctx) => ctx.posts,
    authors: (args, ctx) => ctx.authors,
    postById: (args, ctx) => new Promise((resolve, reject) => {
        setTimeout(() => {
            const found = ctx.posts.find(post => post.id === args.id);
            if (found) {
                resolve(found);
            } else {
                reject('id not found');
            }
        }, 3000);
    })
};

module.exports = app => {
    app.use('/schemaObject-1', graphqlHTTP({
        schema: schema,
        rootValue: root,
        context: { posts, authors },
        graphiql: true,
    }));
};