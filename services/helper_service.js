const { STATUSES } = require('../utils/constants');
const { MOQCHECKFAIL, QTYCHECKFAIL } = require('../utils/constants');
const {
	getCalculatedDiscountPriceForListOfProducts,
	getCalculatedDiscountPrice,
	getCalculatedTaxAndDiscountPrice,
	getListOfTaxcodesByListOfTaxcodeIds,
	getClientByClientId,
} = require('./inner_communication_service');
const {
	getAllDealsRepo,
	getDealByProductIdRepo,
} = require('../repo/deals_repo');
const {
	getDealValueAsString,
	compareDealDates,
	compareDealFutureDates,
} = require('../utils/helper_tools');

// var clientResultMap = new Map();

function getClient(clientId, token) {
	// if (clientResultMap.has(clientId)) {
	// 	return clientResultMap.get(clientId);
	// }
	// let clientResult = await getClientByClientId(clientId, token);
	// clientResultMap.set(clientResult.clientId, clientResult);
	// return clientResult;
	return getClientByClientId(clientId, token);
}

function getDealForProductFromDealResult(productList, dealResult) {
	return productList.map((product) => {
		let deal =
			dealResult == null
				? null
				: dealResult.find(
						(data) =>
							data.productList.find(
								(productId) => product.productId === productId
							) || null
				  );
		return {
			...product,
			deal: deal ? deal : null,
		};
	});
}

function getCategoryHierarchy(categories) {
	let result = [];
	for (let i in categories) {
		let category = categories[i];
		if (category.parentCategoryId !== null) {
			for (let parentCategory of categories) {
				if (category.parentCategoryId === parentCategory.categoryId) {
					if (parentCategory.children) {
						parentCategory.children.push(category);
					} else {
						parentCategory['children'] = [];
						parentCategory.children.push(category);
					}
					break;
				}
			}
		} else {
			result.push(category);
		}
	}
	return result;
}

function filterActiveAndInactiveProducts(productList) {
	return {
		activeProducts: productList.filter(
			(product) => product.status === STATUSES.ACTIVE
		),
		inactiveProducts: productList.filter(
			(product) => product.status === STATUSES.INACTIVE
		),
	};
}

function getProductStockDetail(product) {
	return {
		inStock: product.qtyAvailable >= product.moq,
	};
}

function getProductNewTagDetail(product) {
	return product?.newTag && product.newTag != null
		? {
				newTag: {
					fromDate: product.newTag.fromDate,
					toDate: product.newTag.toDate,
					isNew:
						compareDealDates(
							product.newTag.fromDate,
							product.newTag.toDate
						) && compareDealFutureDates(product.newTag.fromDate),
				},
		  }
		: { newTag: null };
}

function isOngoingDeal(deal) {
	return (
		compareDealDates(deal.fromDate, deal.toDate) &&
		compareDealFutureDates(deal.fromDate)
	);
}

async function getProductListWithCalculatedDealPriceAndStockDetail(
	productList,
	clientId
) {
	let dealResult = await getAllDealsRepo(clientId, false);
	productList = getDealForProductFromDealResult(
		productList,
		dealResult?.filter((deal) => isOngoingDeal(deal))
	);
	let priceResult = await getCalculatedDiscountPriceForListOfProducts(
		productList.map(getDiscountDataForPriceService),
		productList[0].qty ? true : false
	);
	return productList[0].qty
		? {
				productList: productList.map((product) => {
					let res = priceResult.items.find(
						(productWithPrice) =>
							productWithPrice.id === product.productId
					);
					return {
						...product,
						...getProductStockDetail(product),
						...getProductNewTagDetail(product),
						price: res.price,
						totalAmount: res.totalAmount,
					};
				}),
				totalAmountToPay: priceResult.totalAmountToPay,
		  }
		: productList.map((product) => {
				let price = priceResult.items.find(
					(productWithPrice) =>
						productWithPrice.id === product.productId
				).price;
				return {
					...product,
					...getProductStockDetail(product),
					...getProductNewTagDetail(product),
					price: {
						...price,
						discountPrice:
							price.discountPrice <= 0
								? undefined
								: price.discountPrice,
					},
					deal: price.discountPrice <= 0 ? null : product.deal,
				};
		  });
}

async function getProductListWithCalculatedDealPriceAndTaxPrice(
	productList,
	clientId,
	headers
) {
	let taxResult = await getListOfTaxcodesByListOfTaxcodeIds(
		clientId,
		productList.map((product) => ({
			id: product.productId,
			taxcode: product.taxClass,
		})),
		headers
	);
	let dealResult = await getAllDealsRepo(clientId, false);
	productList = getDealForProductFromDealResult(
		productList,
		dealResult?.filter((deal) => isOngoingDeal(deal))
	);
	productList = productList.map((product) => ({
		...product,
		taxClass: taxResult.find((tax) => tax.id === product.productId).taxcode,
	}));
	let priceResult = await getCalculatedTaxAndDiscountPrice(
		productList.map((product) => ({
			...getDiscountDataForPriceService(product),
			...getTaxDataForPriceService(product),
		}))
	);
	return {
		productList: productList.map((product) => {
			let price = priceResult.items.find(
				(res) => product.productId === res.id
			).price;
			return {
				...product,
				price: {
					...price,
					discountPrice:
						price.discountPrice <= 0
							? undefined
							: price.discountPrice,
				},
				deal: price.discountPrice <= 0 ? null : product.deal,
			};
		}),
		totalStateGST: priceResult.totalStateGST,
		totalCentralGST: priceResult.totalCentralGST,
		totalAmountToPayBeforeTax: priceResult.totalAmountToPayBeforeTax,
		totalAmountToPayAfterTax: priceResult.totalAmountToPayAfterTax,
	};
}

function compareDates(fromDate, toDate) {
	return (
		new Date(fromDate).getTime() >= new Date().getTime() ||
		new Date(toDate).getTime() > new Date().getTime()
	);
}

async function getProductWithCalculatedDealPriceAndStockDetail(
	product,
	clientId
) {
	let dealResult = await getDealByProductIdRepo(clientId, product.productId);
	if (dealResult != null) {
		dealResult = isOngoingDeal(dealResult) ? dealResult : null;
	}
	product.deal = dealResult && dealResult != null ? dealResult : null;
	let priceResult = await getCalculatedDiscountPrice(
		getDiscountDataForPriceService(product),
		false
	);
	if (product.deal != null) {
		product.deal.dealType.value = getDealValueAsString(
			product.deal.dealType
		);
	}
	return {
		...product,
		...getProductStockDetail(product),
		...getProductNewTagDetail(product),
		price: priceResult.price,
		deal: product.price.discountPrice == 0 ? null : product.deal,
	};
}

function getDiscountDataForPriceService(product) {
	return {
		id: product.productId,
		price: product.price,
		discount:
			product.deal == null
				? null
				: {
						type: product.deal.dealType.valueType,
						value: product.deal.dealType.value,
				  },
		qty: product.qty ? product.qty : null,
	};
}

function getTaxDataForPriceService(product) {
	return {
		id: product.productId,
		price: product.price,
		tax:
			product.taxClass === null
				? null
				: {
						stateGST: product.taxClass.stateGST,
						centralGST: product.taxClass.centralGST,
				  },
		qty: product.qty ? product.qty : null,
	};
}

function checkMoqAndQtyOnProduct(product) {
	let isCheckFail = false;
	let error = {};
	if (product.qty < product.moq) {
		error['productId'] = product.productId;
		error['message'] = MOQCHECKFAIL;
		isCheckFail = true;
		return {
			isCheckFail,
			error,
			product,
		};
	} else if (product.qty > product.qtyAvailable) {
		error['productId'] = product.productId;
		error['message'] = QTYCHECKFAIL;
		isCheckFail = true;
		return {
			isCheckFail,
			error,
			product,
		};
	} else {
		return { isCheckFail, product };
	}
}

async function getDealForListOfProducts(productList, clientId) {
	let dealResult = await getAllDealsRepo(clientId, false);
	productList = getDealForProductFromDealResult(
		productList,
		dealResult?.filter((deal) => isOngoingDeal(deal))
	);
	return productList.map((product) => ({
		...product,
		...getProductStockDetail(product),
		...getProductNewTagDetail(product),
	}));
}

/*

function converImageToThumnail(req, res) {
	try {
		if (req.file) {
			var writeStream = fs.createWriteStream(
				process.cwd('pwd') + '/public/thumbnails/' + req.file.filename
			);
			console.log(req.file.filename);
			gm(process.cwd('pwd') + '/public/images/' + req.file.filename)
				.resize(240, 240, '!')
				.write(
					process.cwd('pwd') +
						'/public/thumbnails/' +
						req.file.filename,
					function (err) {
						if (err) {
							console.log(err);
						} else {
							console.log('image converted.');
						}
					}
				);
			// .stream('png')
			// .pipe(writeStream)
			res.end();
		}
	} catch (error) {
		console.error(error);
	}
}
*/

module.exports = {
	getClient,
	getCategoryHierarchy,
	filterActiveAndInactiveProducts,
	getProductStockDetail,
	checkMoqAndQtyOnProduct,
	getProductListWithCalculatedDealPriceAndStockDetail,
	getProductWithCalculatedDealPriceAndStockDetail,
	getDiscountDataForPriceService,
	getTaxDataForPriceService,
	getProductListWithCalculatedDealPriceAndTaxPrice,
	getDealForListOfProducts,
	compareDates,
	isOngoingDeal,
	getProductNewTagDetail,
};
