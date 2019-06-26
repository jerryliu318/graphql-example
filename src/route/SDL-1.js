
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

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

class Post {
    constructor (id) {
        this.post = posts.find(post => post.id === id);
        this.id = this.post.id;
        this.title = this.post.title;
        this.votes = this.post.votes;
    }

    authors () {
        return this.post.authorId.map(id => {
            const found = authors.find(author => author.id === id);
            return new Author(found.id);
        });
    }
}

class Author {
    constructor (id) {
        this.author = authors.find(author => author.id === id);
        this.id = this.author.id;
        this.firstName = this.author.firstName;
        this.lastName = this.author.lastName;
    }

    posts () {
        return this.author.postId.map(id => {
            const found = posts.find(post => post.id === id);
            return new Post(found.id);
        });
    }
}

const schema = buildSchema(`
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
`);

console.log('run SDL-1', schema);

const root = {
    posts: (args, ctx) => ctx.posts.map(post => new Post(post.id)),
    authors: (args, ctx) => ctx.authors.map(author => new Author(author.id)),
    postById: (args, ctx) => new Promise((resolve, reject) => {
        setTimeout(() => {
            const found = ctx.posts.find(post => post.id === args.id);
            if (found) {
                resolve(new Post(found.id));
            } else {
                reject('id not found');
            }
        }, 3000);
    })
};

module.exports = app => {
    app.use('/SDL-1', graphqlHTTP({
        schema: schema,
        rootValue: root,
        context: { posts, authors },
        graphiql: true,
    }));
};
