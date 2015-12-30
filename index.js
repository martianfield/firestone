'use strict';

let configuration = {
	mongoUri:"mongodb://localhost:27017/test",
	routes:[]
}

module.exports = {
	config: require(__dirname + '/lib/config.js').bind(configuration),
	routeMaker: require(__dirname + '/lib/routemaker.js').bind(configuration),
	mapMaker: require(__dirname + '/lib/mapmaker.js').bind(configuration)
}

//module.exports.routeMaker = require(__dirname + '/lib/routemaker.js');
//module.exports.mapMaker = require(__dirname + '/lib/mapmaker.js');