
const {
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql');

const schemaObject = new GraphQLObjectType({
    name: 'post',
    fields: () => {
        const authorType = require('./authorType');

        return {
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
                type: new GraphQLList(authorType.schemaObject),
                resolve: (parent, args, ctx) => parent.authorId.map(id => ctx.authors.find(author => author.id === id))
            },
        };
    }
});

const SDL = {
    schema: `
        type Post {
            id: Int!
            title: String!
            votes: Int!
            authors: [Author]
        }
    `,
    resolver: {
        authors: (parent, args, ctx) => parent.authorId.map(id => ctx.authors.find(author => author.id === id))
    }
};

module.exports = { 
    schemaObject: schemaObject,
    SDL: SDL
};