const {
	multipleFilesUploadWithConfig,
} = require('@platform_jewels/bassure-node/service/fileupload');
var express = require('express');
const multer = require('multer');
var dealService = require('../services/deal_service');
const {
	validateDeal,
	handleValidation,
	validateImages,
} = require('../services/validator_service');
const { IMAGE_KEY } = require('../utils/constants');
const {
	GETALLDEALS,
	GETDEALBYDEALID,
	CREATEDEAL,
	UPDATEDEALBYID,
	DELETEDEALBYID,
	GETDEALPRODUCTS,
	GETPRODUCTSWITHOUTDEAL,
	GETDEALPRODUCTSCOUNT,
	GETALLONGOINGDEALS,
} = require('../utils/endpoints');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');

const router = express.Router();

router.get(GETALLDEALS, serviceHandler(dealService.getAllDealsService));

router.get(GETDEALBYDEALID, serviceHandler(dealService.getDealByDealIdService));

router.get(GETDEALPRODUCTS, serviceHandler(dealService.getDealProductsService));

router.get(
	GETPRODUCTSWITHOUTDEAL,
	serviceHandler(dealService.getProductsWithoutDealService)
);

router.get(
	GETDEALPRODUCTSCOUNT,
	serviceHandler(dealService.getDealProductsCountService)
);

router.get(
	GETALLONGOINGDEALS,
	serviceHandler(dealService.getAllOngoingDealsService)
);

router.use(checkUserMiddleware);

router.post(
	CREATEDEAL,
	multipleFilesUploadWithConfig(IMAGE_KEY, {
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 20 * 1024 * 1024,
		},
	}),
	validateDeal(),
	handleValidation(),
	validateImages(IMAGE_KEY),
	serviceHandler(dealService.createDealService)
);

router.put(
	UPDATEDEALBYID,
	multipleFilesUploadWithConfig(IMAGE_KEY, {
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 20 * 1024 * 1024,
		},
	}),
	validateDeal(),
	handleValidation(),
	validateImages(IMAGE_KEY),
	serviceHandler(dealService.updateDealService)
);

router.delete(
	DELETEDEALBYID,
	serviceHandler(dealService.deleteDealByIdService)
);

module.exports = router;
