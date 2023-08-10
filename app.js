var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var morgan = require('morgan');
var logger = require('morgan');
var compression = require('compression');
const config = require('./config/app_config.json');
const token = require('@platform_jewels/bassure-node/service/token');

var db = require('./repo/db_connection');
var {
	PRODUCTBASEURL,
	ATTRIBUTEBASEURL,
	ATTRIBUTESETBASEURL,
	CATEGORYBASEURL,
	CARTBASEURL,
	WISHLISTBASEURL,
	CHECKOUTBASEURL,
	HOMEBASEURL,
	DEALSBASEURL,
	DEALDETAILBASEURL,
	WITHOUTAUTH,
	PING,
} = require('./utils/endpoints');
const { DB_MONGO_CONNECTION_STRING } = require('./utils/urls');

var productRouter = require('./routes/products');
var attributeRouter = require('./routes/attributes');
var attributesetsRouter = require('./routes/attributeset');
var categoryRouter = require('./routes/category');
var cartRouter = require('./routes/cart');
var wishlistRouter = require('./routes/wishlist');
var checkoutRouter = require('./routes/checkout');
var dealRouter = require('./routes/deals');
var dealDetailRouter = require('./routes/dealdetail');
var assetRouter = require('./routes/assets');
const {
	unCaughtExceptionHandler,
	getPingHandler,
} = require('./utils/helper_tools');
const { failedResponse } = require('./services/common_service');
const { customLogger, getExceptionalLogger } = require('./utils/logger');
const { LOGS_DIR } = require('./utils/constants');

var app = express();
db.connect(DB_MONGO_CONNECTION_STRING);

app.use(
	morgan('combined', {
		stream: fs.createWriteStream(
			path.join(LOGS_DIR, 'product_service_app_history.log'),
			{
				flags: 'a',
			}
		),
	})
);
getExceptionalLogger();
app.use(logger('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors({ exposedHeaders: '*' }));
app.use(cookieParser());
app.use(compression());

// API calls without authentication ...

app.use(WITHOUTAUTH, require('./routes/withoutAuth'));

app.get(PING, getPingHandler());

app.get(`${PRODUCTBASEURL}${PING}`, getPingHandler());
app.get(`${ATTRIBUTEBASEURL}${PING}`, getPingHandler());
app.get(`${ATTRIBUTESETBASEURL}${PING}`, getPingHandler());
app.get(`${CATEGORYBASEURL}${PING}`, getPingHandler());
app.get(`${CARTBASEURL}${PING}`, getPingHandler());
app.get(`${WISHLISTBASEURL}${PING}`, getPingHandler());
app.get(`${CHECKOUTBASEURL}${PING}`, getPingHandler());
app.get(`${DEALSBASEURL}${PING}`, getPingHandler());
app.get(`${DEALDETAILBASEURL}${PING}`, getPingHandler());
app.get(`${getPingHandler}${PING}`, getPingHandler());

app.use(token.verifyToken);

app.use(PRODUCTBASEURL, productRouter);
app.use(ATTRIBUTEBASEURL, attributeRouter);
app.use(ATTRIBUTESETBASEURL, attributesetsRouter);
app.use(CATEGORYBASEURL, categoryRouter);
app.use(CARTBASEURL, cartRouter);
app.use(WISHLISTBASEURL, wishlistRouter);
app.use(CHECKOUTBASEURL, checkoutRouter);
app.use(DEALSBASEURL, dealRouter);
app.use(DEALDETAILBASEURL, dealDetailRouter);
app.use(HOMEBASEURL, assetRouter);

// error handler
app.use(function (err, _req, res, _next) {
	customLogger.error({
		fileName: '/app.js',
		functionName: null,
		context: 'Error Handling',
		message: err.message,
		code: err.code || err.status,
	});

	err.code ==="LIMIT_FILE_SIZE" ?   res.locals.responseCode=config.response_code.file_size_limit_exception:res
	failedResponse(res, {
		status: err.status,
		code: err.code,
		message: err.message,
	});
});

process.on('uncaughtException', unCaughtExceptionHandler);
process.on('unhandledRejection', unCaughtExceptionHandler);

app.listen(4000, () => {
	customLogger.info({
		fileName: '/app.js',
		functionName: 'listeningEventHandlerCB',
		context: 'Listening server event',
		message: `Server has been successfully started`,
	});
});

module.exports = app;
