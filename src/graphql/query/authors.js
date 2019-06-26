
const { GraphQLList } = require('graphql');
const authorType = require('../type/authorType');

module.exports = {
    schemaObject: { 
        type: new GraphQLList(authorType.schemaObject),
        resolve: (parent, args, ctx) => ctx.authors 
    },
    SDLResolver: (parent, args, ctx) => ctx.authors
};