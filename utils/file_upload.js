const AWS = require('aws-sdk');
const {
	BUCKET_NAME,
	BUCKET_ACCESS_KEY,
	BUCKET_SECRET_KEY,
	S3_BUCKET_ROOT_DIR,
	S3_BUCKET_FILES_DIR,
} = require('./constants');
const { customLogger } = require('./logger');

const s3 = new AWS.S3({
	accessKeyId: BUCKET_ACCESS_KEY,
	secretAccessKey: BUCKET_SECRET_KEY,
});

async function saveFilesToBucket(files) {
	customLogger.info({
		fileName: '/utils/file_upload.js',
		functionName: 'saveFilesToBucket',
		context: 'Before Execution',
		message: `Going to save files`,
	});
	const results = await Promise.all(
		files.map(async (file) =>
			s3
				.upload({
					Bucket: BUCKET_NAME,
					Key: `${S3_BUCKET_ROOT_DIR}/${S3_BUCKET_FILES_DIR}/${file.originalname}`,
					// ACL: 'public-read',
					ContentEncoding: 'base64',
					ContentDisposition: 'inline',
					contentType: file.mimetype,
					Body: file.buffer,
				})
				.promise()
				.then((result) => result.Location)
		)
	);
	customLogger.info({
		fileName: '/utils/file_upload.js',
		functionName: 'saveFilesToBucket',
		context: 'After Execution',
		message: `Going to return without errors`,
	});
	return results.length === files.length ? results : false;
}

module.exports = {
	saveFilesToBucket,
};
