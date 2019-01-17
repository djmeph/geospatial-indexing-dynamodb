Number.prototype.toRad = function() { return this * Math.PI / 180; }
Number.prototype.toDeg = function() { return this * 180 / Math.PI; }
const Promise = require('bluebird');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { filter, concat } = require('lodash');
const service = {};

service.GeoSearch = GeoSearch;
service.MapCircle = MapCircle;
service.IsInside = IsInside;

function GeoSearch (data) {
    return new Promise(async (resolve, reject) => {
        try {
            const lowlon = MapCircle(concat([], data.coordinates), 180, data.distance)[1];
            const highlon = MapCircle(concat([], data.coordinates), 0, data.distance)[1];
            const lowlat = MapCircle(concat([], data.coordinates), 270, data.distance)[0];
            const highlat = MapCircle(concat([], data.coordinates), 90, data.distance)[0];
            const params = {
                TableName: 'Geolocation',
                FilterExpression: '#longitude >= :lowlon and #longitude <= :highlon and #latitude >= :lowlat and #latitude <= :highlat',
                ExpressionAttributeNames: {
                    '#longitude': 'longitude',
                    '#latitude': 'latitude'
                },
                ExpressionAttributeValues: {
                    ':lowlon': lowlon,
                    ':highlon': highlon,
                    ':lowlat': lowlat,
                    ':highlat': highlat
                }
            };
            const inBox = await dynamoDb.scan(params).promise();
            const result = filter(inBox.Items, item => {
                return IsInside(data.coordinates, [item.latitude, item.longitude], data.distance);
            });
            resolve(result);
        } catch (err) { reject(err) }
    });
};

function MapCircle (coord, brng, dist) {
    dist = dist / 3958.748;
    brng = brng.toRad();
    var lat1 = coord[1].toRad(), lon1 = coord[0].toRad();
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
    if (isNaN(lat2) || isNaN(lon2)) return null;
    return [lon2.toDeg(), lat2.toDeg()];
};

function IsInside (coords1, coords2, searchRadius) {
    var R = 3958.748;
    var dLat = (coords2[0]-coords1[0]).toRad();
    var dLon = (coords2[1]-coords1[1]).toRad();
    var lat1 = (coords1[0]).toRad();
    var lat2 = (coords2[0]).toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d <= searchRadius;
};

module.exports = service;
