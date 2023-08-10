const mongoose = require('mongoose');
const { customLogger } = require('../utils/logger');

var client;

function connect(connString) {
	client = mongoose
		.connect(connString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			ignoreUndefined: true,
			autoIndex: true,
		})
		.then(() => {
			customLogger.info({
				fileName: '/repo/db_connection.js',
				functionName: 'mongooseConnectCB',
				context: 'Connection Establishing',
				message: `'${
					mongoose.connection.name || 'DB'
				}' has been sucessfully connected`,
			});
			return client;
		})
		.catch((err) => {
			customLogger.error({
				fileName: '/repo/db_connection.js',
				functionName: 'mongooseConnectCB',
				context: 'Error Handling',
				message: err.message,
				code: err.code || err.status,
			});
			process.exit(1);
		});
}

mongoose.connection.on('connected', () => {
	customLogger.info({
		fileName: '/repo/db_connection.js',
		functionName: 'connectedEventListenerCB',
		context: 'Listening on connected event',
		message: 'mongoose connected with mongodb',
	});
});
mongoose.connection.on('error', (err) => {
	customLogger.error({
		fileName: '/repo/db_connection.js',
		functionName: 'errorEventListenerCB',
		context: 'Listening on error event',
		message: err.message,
		code: err.code || err.status,
	});
});
mongoose.connection.on('disconnected', () => {
	customLogger.warn({
		fileName: '/repo/db_connection.js',
		functionName: 'disconnectedEventListenerCB',
		context: 'Listening on disconnected event',
		message: 'mongoose disconnected with mongodb',
	});
});

process.on('SIGINT', async () => {
	customLogger.info({
		fileName: '/repo/db_connection.js',
		functionName: 'SIGINTEventListenerCB',
		context: 'Listening on SIGINT event of process',
		message: 'Going to disconnect mongoose connection and exit app',
	});
	await mongoose.connection.close();
	process.exit(0);
});

module.exports = {
	client,
	conn: mongoose.connection,
	connect,
};
