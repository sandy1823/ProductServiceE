const {
	multipleFilesUploadWithConfig,
} = require('@platform_jewels/bassure-node/service/fileupload');
var express = require('express');
const multer = require('multer');
var assetService = require('../services/asset_service');
const { validateImages } = require('../services/validator_service');
const { IMAGE_KEY } = require('../utils/constants');
const {
	GETHOMEPAGEBANNERS,
	UPDATEHOMEBANNERS,
	GETDEFAULTHOMEPAGEBANNERS,
	UPDATEDEFAULTHOMEBANNERS,
} = require('../utils/endpoints');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');

const router = express.Router();

router.get(
	GETHOMEPAGEBANNERS,
	serviceHandler(assetService.getHomePageBannersService)
);

router.get(
	GETDEFAULTHOMEPAGEBANNERS,
	serviceHandler(assetService.getDefaultHomePageBannersService)
);

router.use(checkUserMiddleware);

router.post(
	UPDATEHOMEBANNERS,
	multipleFilesUploadWithConfig(IMAGE_KEY, {
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 20 * 1024 * 1024,
		},
	}),
	validateImages(IMAGE_KEY),
	serviceHandler(assetService.updateHomebannersService)
);

router.post(
	UPDATEDEFAULTHOMEBANNERS,
	multipleFilesUploadWithConfig(IMAGE_KEY, {
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 20 * 1024 * 1024,
		},
	}),
	validateImages(IMAGE_KEY),
	serviceHandler(assetService.updateDefaultHomebannersService)
);

module.exports = router;
