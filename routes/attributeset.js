var express = require('express');
var attributeSetService = require('../services/attributeset_service');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	validateAttributeset,
	handleValidation,
} = require('../services/validator_service');
const {
	GETALLATTRIBUTESET,
	UPDATEATTRIBUTESETBYID,
	CREATEATTRIBUTESET,
	DELETEATTRIBUTESETBYID,
} = require('../utils/endpoints');

const router = express.Router();

router.get(
	GETALLATTRIBUTESET,
	serviceHandler(attributeSetService.getAllAttributeSetService)
);

router.use(checkUserMiddleware);

router.post(
	CREATEATTRIBUTESET,
	validateAttributeset(),
	handleValidation(),
	serviceHandler(attributeSetService.createAttributeSetService)
);

router.delete(
	DELETEATTRIBUTESETBYID,
	serviceHandler(attributeSetService.deleteAttributeSetByIdService)
);

router.put(
	UPDATEATTRIBUTESETBYID,
	validateAttributeset(),
	handleValidation(),
	serviceHandler(attributeSetService.updateAttributeSetByIdService)
);

module.exports = router;
