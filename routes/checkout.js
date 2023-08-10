var express = require('express');
var checkoutService = require('../services/checkout_service');
const { serviceHandler } = require('../services/common_service');
const { checkUserMiddleware } = require('../services/middlewares');
const {
	validateAddressAndSchduleDateForCheckout,
	handleValidation,
} = require('../services/validator_service');
const {
	GETCHECKOUTBYID,
	CREATECHECKOUT,
	CREATECHECKOUTFROMPREVIOUSORDER,
	ADDADDRESSANDSCHEDULEDDATE,
	DELETECHECKOUTBYID,
	GETPROFORMAINVOICE,
	REVERTCHECKOUT,
	CREATECHECKOUTFROMWISHLIST,
	CREATECHECKOUTFROMPRODUCTLIST,
} = require('../utils/endpoints');

const router = express.Router();

router.get(
	GETCHECKOUTBYID,
	serviceHandler(checkoutService.getCheckoutByIdService)
);

router.delete(
	DELETECHECKOUTBYID,
	serviceHandler(checkoutService.deleteCheckoutByIdService)
);

router.get(GETPROFORMAINVOICE, checkoutService.getProformaInvoiceService);

router.delete(
	REVERTCHECKOUT,
	serviceHandler(checkoutService.revertCheckoutService)
);

router.use(checkUserMiddleware);

router.post(
	CREATECHECKOUT,
	serviceHandler(checkoutService.createCheckoutService)
);

router.post(
	CREATECHECKOUTFROMPREVIOUSORDER,
	serviceHandler(checkoutService.createCheckoutFromPreviosOrderService)
);

router.put(
	ADDADDRESSANDSCHEDULEDDATE,
	validateAddressAndSchduleDateForCheckout(),
	handleValidation(),
	serviceHandler(checkoutService.addAddressAndScheduledDateService)
);

router.post(
	CREATECHECKOUTFROMWISHLIST,
	serviceHandler(checkoutService.createCheckoutFromWishlistService)
);

router.post(
	CREATECHECKOUTFROMPRODUCTLIST,
	serviceHandler(checkoutService.createCheckoutFromProductListService)
);

module.exports = router;
