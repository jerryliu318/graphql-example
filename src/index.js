const express = require('express');
const bodyParser = require('body-parser');

const route = require('./route');

/** server setting */

const app = express();

// configuring express to use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// html template
app.set('views', 'views');
app.set('view engine', 'ejs');

// routing
route(app);

const port = 3000;
app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});
