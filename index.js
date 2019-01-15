const { api } = require('./routes');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, accesstoken, partnerid");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(bodyParser.json({ type: 'application/json'}));
app.use('/', api);
app.use(function (req, res, next) {
    res.status(404).json({ message: 'NOT FOUND' });
});

module.exports = {
    handler: serverless(app),
    app
}
