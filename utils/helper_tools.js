const { default: axios } = require('axios');
const { DEALTYPE } = require('../utils/constants');
const { customLogger } = require('./logger');

function getDealValueAsString(dealType) {
	let dealValue = '';
	switch (dealType.valueType) {
		case DEALTYPE.INPERCENTAGE:
			dealValue = `${dealType.value}%`;
			break;

		case DEALTYPE.INRUPEES:
			dealValue = null;
			break;
	}
	return {
		value: dealValue,
	};
}

function dateParser(serial) {
	try {
		let hours = Math.floor((serial % 1) * 24);
		let minutes = Math.floor(((serial % 1) * 24 - hours) * 60);
		return new Date(Date.UTC(0, 0, serial, hours - 17, minutes));
	} catch (error) {
		return false;
	}
}

function compareDealDates(fromDate, toDate) {
	return (
		new Date(fromDate).getTime() >= new Date().getTime() ||
		new Date(toDate).getTime() >= new Date().getTime()
	);
}
function compareDealFutureDates(fromDate) {
	return new Date(fromDate).getTime() <= new Date().getTime();
}

async function fetchFile(src) {
	return axios.get(src, { responseType: 'arraybuffer' }).then((res) => {
		customLogger.info({
			fileName: '/utils/helper_tools.js',
			functionName: 'fetchFileCB',
			context: 'After getting response',
			message: `Got Response with status code ${res.status}`,
		});
		if (res.status == 200 && res.config.responseType == 'arraybuffer') {
			customLogger.info({
				fileName: '/utils/helper_tools.js',
				functionName: 'fetchFileCB',
				context: `If condition's true block`,
				message: `Going to return response`,
			});
			return res.data;
		}
		customLogger.warn({
			fileName: '/utils/helper_tools.js',
			functionName: 'fetchFileCB',
			context: `Condition check failed`,
			message: `Going to throw ApiException `,
		});
		throw new Error('Unable to fetch file');
	});
}

function getRandomId(prefix) {
	return `${prefix.toUpperCase()}${(
		Math.round(Math.random() * 9000000000) + 10000
	).toString()}`;
}

function getDateLocaleStringToCompare(date) {
	return new Date(date).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	});
}

function range(start, stop, step) {
	let result = [];
	for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}
	return result;
}

function chunkArray(array, chunkSize, topChunkSize) {
	let result = [];
	if (topChunkSize) result.push(array.splice(0, topChunkSize));
	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize));
	}
	return result;
}

function unCaughtExceptionHandler(error) {
	customLogger.error({
		fileName: `/utils/helper_tools.js`,
		functionName: unCaughtExceptionHandler,
		context: 'Error Handling',
		message: error.message,
		code: error.code || error.status,
	});
	process.exit(1);
}

function getPingHandler() {
	return (req, res, _next) => {
		customLogger.info({
			fileName: `/utils/helper_tools.js`,
			functionName: 'getPingHandlerCB',
			context: 'ping handler',
			message: `Inside '${req.originalUrl}' of Product service`,
		});
		res.end(`Inside '${req.originalUrl}' of Product service`);
	};
}

function getAuthTokenFromRequest(req) {
	return {
		authorization: req.headers.authorization,
	};
}

module.exports = {
	fetchFile,
	getRandomId,
	getDealValueAsString,
	getDateLocaleStringToCompare,
	range,
	chunkArray,
	dateParser,
	compareDealFutureDates,
	compareDealDates,
	unCaughtExceptionHandler,
	getAuthTokenFromRequest,
	getPingHandler,
};
