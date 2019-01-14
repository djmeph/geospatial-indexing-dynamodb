const { Geolocation } = require('../services');

module.exports = {
    method: 'get',
    endpoint: '/geospatial-search-radius',
    middleware: [async (req, res, next) => {

        try {

            const matches = await Geolocation.GeoSearch(req.body);

            req.data = { status: 200, result: matches };
            next();

        } catch (err) { fail(err); }

        function fail (err) {
            console.error(err);
            req.data = { status: err.statusCode || 500, result: { message: err.message } };
            next();
        }

    }]
};
