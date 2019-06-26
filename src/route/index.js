
const schemaObject1 = require('./schemaObject-1');
const schemaObject2a = require('./schemaObject-2a');
const schemaObject2b = require('./schemaObject-2b');
const SDL1 = require('./SDL-1');
const SDL2a = require('./SDL-2a');
const SDL2b = require('./SDL-2b');

module.exports = app => {
    schemaObject1(app);
    schemaObject2a(app);
    schemaObject2b(app);
    SDL1(app);
    SDL2a(app);
    SDL2b(app);
};