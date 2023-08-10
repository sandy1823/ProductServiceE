var express = require('express');
const { serviceHandler } = require('../services/common_service');
var dealDetailService = require('../services/dealdetail_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	validateDealDetail,
	handleValidation,
} = require('../services/validator_service');
const {
	GETALLDEALDETAILS,
	GETDEALDETAILBYID,
	CREATEDEALDETAIL,
	UPDATEDEALDETAIL,
	DELETEDEALDETAILBYID,
} = require('../utils/endpoints');

const router = express.Router();

router.get(
	GETALLDEALDETAILS,
	serviceHandler(dealDetailService.getAllDealTypesService)
);

router.use(checkUserMiddleware);

router.get(
	GETDEALDETAILBYID,
	serviceHandler(dealDetailService.getDealDetailByDealDetailIdService)
);

router.post(
	CREATEDEALDETAIL,
	validateDealDetail(),
	handleValidation(),
	serviceHandler(dealDetailService.createDealDetailService)
);

router.put(
	UPDATEDEALDETAIL,
	validateDealDetail(),
	handleValidation(),
	serviceHandler(dealDetailService.updateDealDetailService)
);

router.delete(
	DELETEDEALDETAILBYID,
	serviceHandler(dealDetailService.deletedealDetailByIdService)
);

module.exports = router;
