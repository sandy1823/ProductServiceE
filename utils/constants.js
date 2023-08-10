module.exports = {
	// APP_LOC: process.cwd('pwd'),

	IMAGE_KEY: 'multiImages',
	CSV_FILENAME: 'productData',

	DEFAULT_DELIVERYCHARGE: process.env.DEFAULT_DELIVERY_CHARGE || 100,

	CHECKOUT_SCHEDULER_MINUTE:
		process.env.CHECKOUT_SCHEDULER_DEFAULT_DURATION || 10,

	BUCKET_NAME: process.env.BUCKET_NAME || 'bas-oms-uat-bucket',
	BUCKET_ACCESS_KEY: process.env.BUCKET_ACCESS_KEY || "AKIAZUEG53V36PZI23KP",
	BUCKET_SECRET_KEY: process.env.BUCKET_SECRET_KEY || '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',

	S3_BUCKET_ROOT_DIR: 'om-data',
	S3_BUCKET_OTHERS_DIR: 'others',
	S3_BUCKET_THUMBNAILS_DIR: 'thumbnails',
	S3_BUCKET_FILES_DIR: 'files',

	STATUSES: {
		ACTIVE: 'ACTIVE',
		INACTIVE: 'INACTIVE',
	},

	DEALTYPE: {
		INPERCENTAGE: 'INPERCENTAGE',
		INRUPEES: 'INRUPEES',
	},

	ACTION: {
		INCREASE: 'INCREASE',
		DECREASE: 'DECREASE',
	},

	MOQCHECKFAIL: 'moq check failed',
	QTYCHECKFAIL: 'qty check failed',

	DEFAULT_CATEGORY_PROPS: {
		categoryName: 'Default Category',
		categoryDesc: `Default category for this distributer`,
		isAnchor: false,
	},

	DEFAULT_PRODUCT_PROPS: {
		priceCategory: 'fixed',
		productType: 'normal',
	},

	HTTP_METHOD: {
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE',
	},

	LOGS_DIR: process.env.LOGS_DIR || `${process.cwd()}/logs`,
};
