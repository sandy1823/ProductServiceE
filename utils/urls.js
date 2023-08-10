module.exports = {
	// APIGATEWAY: process.env.APISERVICE,

	DB_MONGO_CONNECTION_STRING: `mongodb://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@${process.env.DB_MONGO_HOST}:${process.env.DB_MONGO_PORT}/${process.env.DB_MONGO_DATABASE}`,
	// DB_MONGO_CONNECTION_STRING: `mongodb://oms-products:oms-pro-001@dev.bassure.in:27017/oms-products`,

	USER_SERVICE_GATEWAY: process.env.USERSERVICE || `http://localhost:3500`,
	USER_SERVICE_GETADDRESS_BY_ADDRESSID: 'buyers/getBuyerAddressByAddressId',
	USER_SERVICE_GETUSERDETAILS: 'buyers/getUserDetailsByUserId',
	USER_SERVICE_GETCLIENT_BY_CLIENTID: 'buyers/getClientByClientId',
	USER_SERVICE_CHECK_USER: 'buyers/checkUser',

	PRICE_SERVICE_GATEWAY: process.env.PRICESERVICE || `http://localhost:4300`,
	PRICE_SERVICE_GETDISCOUNTPRICE_FOR_LIST_OF_ITEMS:
		'price/getDiscountPriceForListOfItems',
	PRICE_SERVICE_CALCULATETAX_AND_DISCOUNTPRICE:
		'price/getTaxAndDiscountCalculatedPriceForListOfItems',
	PRICE_SERVICE_GETDISCOUNTPRICE: 'price/getDiscountPrice',

	TAX_SERVICE_GATEWAY: process.env.TAXSERVICE || 'http://localhost:4200',
	TAX_SERVICE_GETALLTAXCODES: 'taxcode/getAllTaxCodes',
	TAX_SERVICE_GETTAXCODE_BY_TAXCODEID: 'taxcode/getTaxcodeByTaxcodeId',
	TAX_SERVICE_GETALLTAXCODES_BY_LISTOFIDS:
		'taxcode/getListOfTaxcodesByListOfTaxcodeIds',
	TAX_SERVICE_GETALLTAXCODES_BY_LISTOFNAMES:
		'taxcode/getListOfTaxcodesByListOfTaxcodeNames',
	TAX_SERVICE_GETALLTAXCODENAMES: 'taxcode/getAllTaxCodeNames',

	SCHEDULER_SERVICE_JAVA_GATEWAY:
		process.env.JAVASCHEDULERSERVICE || 'http://localhost:8081',
	SCHEDULER_SERVICE_CREATE_SCHEDULER: 'job/setScheduler/',
	SCHEDULER_SERVICE_CREATE_REPEATSCHEDULER: 'job/setRepeatScheduler',
	SCHEDULER_SERVICE_DESTROYSCHEDULER: 'job/destroyScheduler',

	PRODUCT_SERVICE_GATEWAY:
		process.env.PRODUCTSERVICE || 'http://localhost:4000',
};
