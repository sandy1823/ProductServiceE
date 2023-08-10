const { commonCall } = require('../utils/common_calls');
const { GET, POST, PUT, DELETE } = require('../utils/constants').HTTP_METHOD;
const {
	PRICE_SERVICE_GETDISCOUNTPRICE_FOR_LIST_OF_ITEMS,
	PRICE_SERVICE_CALCULATETAX_AND_DISCOUNTPRICE,
	TAX_SERVICE_GETALLTAXCODES,
	TAX_SERVICE_GETTAXCODE_BY_TAXCODEID,
	PRICE_SERVICE_GETDISCOUNTPRICE,
	TAX_SERVICE_GETALLTAXCODES_BY_LISTOFIDS,
	USER_SERVICE_GETUSERDETAILS,
	SCHEDULER_SERVICE_CREATE_SCHEDULER,
	SCHEDULER_SERVICE_DESTROYSCHEDULER,
	USER_SERVICE_GETADDRESS_BY_ADDRESSID,
	USER_SERVICE_GETCLIENT_BY_CLIENTID,
	USER_SERVICE_GATEWAY,
	TAX_SERVICE_GATEWAY,
	PRICE_SERVICE_GATEWAY,
	SCHEDULER_SERVICE_JAVA_GATEWAY,
	TAX_SERVICE_GETALLTAXCODENAMES,
	TAX_SERVICE_GETALLTAXCODES_BY_LISTOFNAMES,
	USER_SERVICE_CHECK_USER,
} = require('../utils/urls');

const javaResponseHandler = (response) => {
	if (response.code == 600 && response.error == null) {
		return response.value;
	} else {
		throw new ApiException({
			message: 'Unable to get proper response',
			responseCode: config.response_code.expectation_failed,
			errorData: response.code,
		});
	}
};

function getUserDetailByUserId(buyerId, userId, headers) {
	return commonCall({
		url: `${USER_SERVICE_GATEWAY}/${USER_SERVICE_GETUSERDETAILS}/${userId}`,
		method: GET,
		params: { buyerId },
		errorMsg: `Unable to get User details from user service`,
		headers,
	});
}

function getUserAddressByAddressId(buyerId, addressId, headers) {
	return commonCall({
		url: `${USER_SERVICE_GATEWAY}/${USER_SERVICE_GETADDRESS_BY_ADDRESSID}/${addressId}`,
		method: GET,
		params: { buyerId },
		errorMsg: `Unable to get address from user service`,
		headers,
	});
}

function getCalculatedDiscountPrice(data, withQty) {
	return commonCall({
		url: `${PRICE_SERVICE_GATEWAY}/${PRICE_SERVICE_GETDISCOUNTPRICE}`,
		method: GET,
		params: {
			withQty,
		},
		data,
		errorMsg: `Unable calculate discount price`,
	});
}

function getCalculatedDiscountPriceForListOfProducts(
	productList,
	withQty = false
) {
	return commonCall({
		url: `${PRICE_SERVICE_GATEWAY}/${PRICE_SERVICE_GETDISCOUNTPRICE_FOR_LIST_OF_ITEMS}`,
		method: GET,
		params: {
			withQty,
		},
		data: {
			items: productList,
		},
		errorMsg: `Unable calculate discount price`,
	});
}

function getCalculatedTaxAndDiscountPrice(productList) {
	return commonCall({
		url: `${PRICE_SERVICE_GATEWAY}/${PRICE_SERVICE_CALCULATETAX_AND_DISCOUNTPRICE}`,
		method: GET,
		data: {
			items: productList,
		},
		errorMsg: `Unable calculate tax and discount price`,
	});
}

function getAllTaxCodes(clientId, headers) {
	return commonCall({
		url: `${TAX_SERVICE_GATEWAY}/${TAX_SERVICE_GETALLTAXCODES}`,
		method: GET,
		params: { clientId },
		headers,
		errorMsg: `Unable to getAll taxcodes`,
	});
}

function getTaxcodeById(clientId, taxcodeId, headers) {
	return commonCall({
		url: `${TAX_SERVICE_GATEWAY}/${TAX_SERVICE_GETTAXCODE_BY_TAXCODEID}/${taxcodeId}`,
		method: GET,
		params: { clientId },
		headers,
		errorMsg: `Unable to get taxcode`,
	});
}

function getListOfTaxcodesByListOfTaxcodeIds(clientId, taxcodeIds, headers) {
	return commonCall({
		url: `${TAX_SERVICE_GATEWAY}/${TAX_SERVICE_GETALLTAXCODES_BY_LISTOFIDS}`,
		method: GET,
		params: { clientId },
		data: { taxcodeIds },
		headers,
		errorMsg: `Unable to get taxcodes by tax code ids`,
	});
}
function getListOfTaxcodesByListOfTaxcodeNames(
	clientId,
	taxcodeNames,
	headers
) {
	return commonCall({
		url: `${TAX_SERVICE_GATEWAY}/${TAX_SERVICE_GETALLTAXCODES_BY_LISTOFNAMES}`,
		method: GET,
		params: { clientId },
		data: { taxcodeNames },
		headers,
		errorMsg: `Unable to get taxcodes by tax code names`,
		resultCB: (response) => {
			if (response.header.code == 600 && response.error == null) {
				return response.data.value;
			} else if (response.header.code == 615 && response.error == null) {
				return [];
			} else {
				throw new ApiException({
					message: 'Unable to get proper response',
					responseCode: config.response_code.expectation_failed,
					errorData: response.header.code,
					bodyData: response.error,
				});
			}
		},
	});
}

function createScheduler(minute, data) {
	return commonCall({
		url: `${SCHEDULER_SERVICE_JAVA_GATEWAY}/${SCHEDULER_SERVICE_CREATE_SCHEDULER}`,
		method: POST,
		params: { minute },
		data,
		resultCB: javaResponseHandler,
		errorMsg: `Unable to create Scheduler`,
	});
}

function destroyScheduler(id) {
	return commonCall({
		url: `${SCHEDULER_SERVICE_JAVA_GATEWAY}/${SCHEDULER_SERVICE_DESTROYSCHEDULER}/${id}`,
		method: DELETE,
		resultCB: javaResponseHandler,
		errorMsg: `Unable to destroy Scheduler`,
	});
}

function getClientByClientId(clientId, headers) {
	return commonCall({
		url: `${USER_SERVICE_GATEWAY}/${USER_SERVICE_GETCLIENT_BY_CLIENTID}/${clientId}`,
		method: 'GET',
		headers,
		errorMsg: 'Unable to get client detail',
	});
}

function checkUser(headers) {
	return commonCall({
		url: `${USER_SERVICE_GATEWAY}/${USER_SERVICE_CHECK_USER}`,
		method: 'GET',
		headers,
		errorMsg: 'Unable to check user',
		resultCB: (response) =>
			response.header.code == 600 && response.error == null,
	});
}

function getAllTaxCodeNames(clientId, headers) {
	return commonCall({
		url: `${TAX_SERVICE_GATEWAY}/${TAX_SERVICE_GETALLTAXCODENAMES}`,
		method: GET,
		params: { clientId },
		headers,
		errorMsg: `Unable to getAll taxcodes names`,
		resultCB: (response) => {
			if (
				(response.header.code == 600 || response.header.code == 615) &&
				response.error == null
			) {
				return response.data.value;
			} else {
				throw new ApiException({
					message: 'Unable to get proper response',
					responseCode: config.response_code.expectation_failed,
					errorData: response.header.code,
					bodyData: response.error,
				});
			}
		},
	});
}

module.exports = {
	getUserDetailByUserId,
	getCalculatedDiscountPrice,
	getCalculatedDiscountPriceForListOfProducts,
	getCalculatedTaxAndDiscountPrice,
	getAllTaxCodes,
	getTaxcodeById,
	getListOfTaxcodesByListOfTaxcodeIds,
	getListOfTaxcodesByListOfTaxcodeNames,
	createScheduler,
	destroyScheduler,
	getUserAddressByAddressId,
	getClientByClientId,
	checkUser,
	getAllTaxCodeNames,
};
