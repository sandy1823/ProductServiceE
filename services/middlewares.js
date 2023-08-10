const { getAuthTokenFromRequest } = require('../utils/helper_tools');
const { failedResponse } = require('./common_service');
const { checkUser } = require('./inner_communication_service');
const config = require('../config/app_config.json');

async function checkUserMiddleware(request, response, next) {
	try {
		if (await checkUser(getAuthTokenFromRequest(request))) {
			next();
		} else {
			response.locals.responseCode = config.response_code.user_not_exists;
			failedResponse(response, { message: 'User not found' });
		}
	} catch (error) {
		response.locals.responseCode = config.response_code.user_not_exists;
		failedResponse(response, { message: 'User not found' });
	}
}

module.exports = { checkUserMiddleware };
