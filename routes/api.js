const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const libs = require('../libs');
const _ = require('lodash');

libs.forEach(lib =>
    router[lib.method](lib.endpoint,
        _.merge([bodyParser.json(), lib.middleware]),
        (req, res) => res.status(req.data.status).json(req.data.result)
    )
);

module.exports = router;
