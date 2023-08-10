const { customLogger } = require('../utils/logger');
var Checkout = require('./schemas/checkout_schema');

function getCheckoutByIdRepo(checkoutId, clientId, buyerId, userId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getCheckoutByIdRepo',
		context: 'Before Execution',
		message: 'getting checkout id ',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getCheckoutByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Checkout.findOne(
		{
			clientId: clientId,
			checkoutId: checkoutId,
			buyerId: buyerId,
			userId: userId,
		},
		{
			_id: 0,
			__v: 0,
		}
	)
		.lean()
		.exec();
}

async function createCheckoutRepo(record) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'createCheckoutRepo',
		context: 'Before Execution',
		message: 'create checkout ',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'createCheckoutRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return (await Checkout.create(record)).toObject();
}

async function deleteCheckoutByIdRepo(checkoutId, clientId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'deleteCheckoutByIdRepo',
		context: 'Before Execution',
		message: 'delete checkout by id',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'deleteCheckoutByIdRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Checkout.deleteOne({
		checkoutId: checkoutId,
		clientId: clientId,
	})
		.exec()
		.then((result) => result.deletedCount);
}

function deleteCheckoutByIdAndGetRepo(checkoutId, clientId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'deleteCheckoutByIdAndGetRepo',
		context: 'Before Execution',
		message: 'delete checkout by id and get',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'deleteCheckoutByIdAndGetRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Checkout.findOneAndDelete({
		checkoutId: checkoutId,
		clientId: clientId,
	}).exec();
}

function addAddressAndScheduledDateRepo(
	checkoutId,
	clientId,
	buyerId,
	userId,
	record
) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'addAddressAndScheduledDateRepo',
		context: 'Before Execution',
		message: 'add address and schedule date',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'addAddressAndScheduledDateRepo',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Checkout.findOneAndUpdate(
		{
			checkoutId: checkoutId,
			clientId: clientId,
			buyerId: buyerId,
			uesrId: userId,
		},
		{
			$set: record,
		},
		{
			upsert: false,
			new: true,
			projection: {
				_id: 0,
				__v: 0,
			},
		}
	);
}

async function getCheckoutProductListByCheckoutId(clientId, checkoutId) {
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getCheckoutProductListByCheckoutId',
		context: 'Before Execution',
		message: 'getting checkout product list by checkout id',
	});
	customLogger.info({
		fileName: '/repo/checkout_repo',
		functionName: 'getCheckoutProductListByCheckoutId',
		context: 'After Execution',
		message: 'Going to return without errors',
	});
	return Checkout.findOne(
		{ clientId, checkoutId },
		{ productList: true, _id: false }
	)
		.lean()
		.exec()
		.then((result) => result.productList);
}

module.exports = {
	getCheckoutByIdRepo,
	createCheckoutRepo,
	deleteCheckoutByIdRepo,
	addAddressAndScheduledDateRepo,
	getCheckoutProductListByCheckoutId,
	deleteCheckoutByIdAndGetRepo,
};
