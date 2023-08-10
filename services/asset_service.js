var assetRepo = require('../repo/assets_repo');
var config = require('../config/app_config.json');
const { getRandomId } = require('../utils/helper_tools');
const { saveFilesToBucket } = require('../utils/file_upload');
const ApiException = require('../models/ApiException');
const { customLogger } = require('../utils/logger');

function getHomePageBannersService(req, _res) {
	customLogger.info({
		fileName: '/services/asset_service.js',
		functionName: 'getHomePageBannersService',
		context: 'Before Execution',
		message: 'get Home Page Banners',
	});
	customLogger.info({
		fileName: '/services/asset_service.js',
		functionName: 'getHomePageBannersService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return assetRepo.getHomePageBannersRepo(req.query.clientId);
}
function getDefaultHomePageBannersService(_req, _res) {
	customLogger.info({
		fileName: '/services/asset_service.js',
		functionName: 'getDefaultHomePageBannersService',
		context: 'Before Execution',
		message: 'getting Home Page Banners',
	});
	customLogger.info({
		fileName: '/services/asset_service.js',
		functionName: 'getDefaultHomePageBannersService',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return assetRepo.getDefaultHomePageBannersRepo();
}
async function updateHomebannersService(req, _res) {
	customLogger.info({
		fileName: '/services/asset_service.js',
		functionName: 'updateHomebannersService',
		context: 'Before Execution',
		message: 'update Home Banners',
	});
	const saveFilesResults = await saveFilesToBucket(req.files);
	let homeBanners = req.body?.homeBanners
		? JSON.parse(req.body.homeBanners)
		: [];
	if (saveFilesResults) {
		customLogger.info({
			fileName: '/services/asset_service.js',
			functionName: 'updateHomebannersService',
			context: 'if block true condition',
			message: 'update Home Banners',
		});

		return assetRepo.updateHomeBannersRepo(
			req.query.clientId,
			req.query.userId,
			homeBanners.concat(
				saveFilesResults.map((banner) => ({
					bannerLoc: banner,
					id: getRandomId('BANNER'),
				}))
			)
		);
	} else {
		customLogger.warn({
			fileName: '/services/asset_service.js',
			functionName: 'updateHomebannersService',
			context: 'else block false condition',
			message: 'Unable to Store Banner Images',
		});
		throw new ApiException({
			message: 'Unable to Store Banner Images',
			responseCode: config.response_code.unable_to_store_files,
		});
	}
}
async function updateDefaultHomebannersService(req, _res) {
	customLogger.info({
		fileName: '/services/asset_service.js',
		functionName: 'updateDefaultHomebannersService',
		context: 'Before Execution',
		message: 'update Default Home banners Service',
	});
	const saveFilesResults = await saveFilesToBucket(req.files);
	let defaultHomeBanners = req.body?.defaultHomeBanners
		? JSON.parse(req.body.defaultHomeBanners)
		: [];
	if (saveFilesResults) {
		customLogger.info({
			fileName: '/services/asset_service.js',
			functionName: 'updateDefaultHomebannersService',
			context: 'if block true condition',
			message: 'update Default Home Banners',
		});

		return assetRepo.updateDefaultHomeBannersRepo(
			req.query.userId,
			defaultHomeBanners.concat(
				saveFilesResults.map((banner) => ({
					bannerLoc: banner,
					id: getRandomId('DEFAULTBANNER'),
				}))
			)
		);
	} else {
		customLogger.warn({
			fileName: '/services/asset_service.js',
			functionName: 'updateHomebannersService',
			context: 'else block false condition',
			message: 'Unable to Store Default Banner Images',
		});
		throw new ApiException({
			message: 'Unable to Store Default Banner Images',
			responseCode: config.response_code.unable_to_store_files,
		});
	}
}
module.exports = {
	getHomePageBannersService,
	updateHomebannersService,
	getDefaultHomePageBannersService,
	updateDefaultHomebannersService,
};
