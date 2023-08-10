var express = require('express');
var attributeService = require('../services/attribute_service');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	validateAttribute,
	handleValidation,
} = require('../services/validator_service');
const { GETALLATTRIBUTES, CREATEATTRIBUTE } = require('../utils/endpoints');

const router = express.Router();

router.get(
	GETALLATTRIBUTES,
	serviceHandler(attributeService.getAllAttributeService)
);

router.use(checkUserMiddleware);

router.post(
	CREATEATTRIBUTE,
	validateAttribute(),
	handleValidation(),
	serviceHandler(attributeService.createAttributeService)
);

module.exports = router;
