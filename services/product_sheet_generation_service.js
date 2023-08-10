const ExcelJS = require('exceljs');
const config = require('../config/app_config.json');
const sheetConfig = require('../config/product_upload_sheet.json');
const ApiException = require('../models/ApiException');

async function getProductExportSheet(_categories, taxclasses, productsList) {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'system';
	workbook.created = new Date();
	workbook.modified = new Date();
	workbook.title = 'Product Upload Sheet';
	const worksheetInstructions = workbook.addWorksheet(
		sheetConfig.sheet_names.instructions,
		{
			properties: { tabColor: { argb: '#FF4500' } },
			state: 'visible',
		}
	);
	worksheetInstructions.columns = [
		{
			header: 'Instructions',
			width: 100,
			isDefault: true,
			style: {
				alignment: { vertical: 'top', horizontal: 'left' },
			},
		},
	];
	worksheetInstructions.getCell('A1').style = {
		alignment: { vertical: 'middle', horizontal: 'center' },
		font: {
			size: 16,
			underline: true,
			bold: true,
			color: { argb: '#FF4500' },
		},
	};
	sheetConfig.instructions.forEach((instruction) => {
		worksheetInstructions.insertRow(3, [`* ${instruction}`]);
	});
	worksheetInstructions.protect(sheetConfig.sheet_encrypt_pwd);

	const worksheetProductdetails = workbook.addWorksheet(
		sheetConfig.sheet_names.products_details,
		{
			properties: { tabColor: { argb: '#00FF00' } },
			state: 'visible',
			views: [{ state: 'frozen', ySplit: 1 }],
		}
	);
	worksheetProductdetails.columns = [
		{
			header: sheetConfig.product_sheet_fields_names.productId,
			key: 'productId',
			width: 18,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.productName,
			key: 'productName',
			width: 45,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.productDesc,
			key: 'productDesc',
			width: 50,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.price,
			key: 'price',
			width: 20,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names
				.minimumAdvertisablePrice,
			key: 'minimumAdvertisablePrice',
			width: 48,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.priceCategory,
			key: 'priceCategory',
			width: 25,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.productType,
			key: 'productType',
			width: 32,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.supplier,
			key: 'supplier',
			width: 40,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.qtyAvailable,
			key: 'qtyAvailable',
			width: 25,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.moq,
			key: 'moq',
			width: 48,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.leadTime,
			key: 'leadTime',
			width: 18,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.fromDate,
			key: 'fromDate',
			width: 25,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
				numFmt: 'dd/mm/yyyy',
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.toDate,
			key: 'toDate',
			width: 20,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
				numFmt: 'dd/mm/yyyy',
			},
		},
		{
			header: sheetConfig.product_sheet_fields_names.taxClass,
			key: 'taxClass',
			width: 25,
			isDefault: true,
			style: {
				alignment: {
					vertical: 'middle',
					horizontal: 'center',
				},
			},
		},
	];
	worksheetProductdetails.getRow(1).eachCell((cell) => {
		cell.note = sheetConfig.product_fields_notes[cell._column._key];
		cell.style = {
			alignment: {
				vertical: 'middle',
				horizontal: 'center',
			},
			font: {
				size: 16,
				bold: true,
			},
		};
	});
	worksheetProductdetails.dataValidations.add('A2:A9999', {
		type: 'textLength',
		operator: 'between',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [3, 10],
		promptTitle: 'Product Id length',
		prompt: 'Product Id should be less than 10 characters',
	});
	worksheetProductdetails.dataValidations.add('B2:B9999', {
		type: 'textLength',
		operator: 'greaterThan',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [2],
		promptTitle: 'Product Name length',
		prompt: 'Product name should be greater than 3 characters',
	});
	worksheetProductdetails.dataValidations.add('C2:C9999', {
		type: 'textLength',
		operator: 'lessThan',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [500],
		promptTitle: 'Description length',
		prompt: 'Description should be less than 500 characters',
	});
	worksheetProductdetails.dataValidations.add('D2:D9999', {
		type: 'decimal',
		operator: 'greaterThan',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [0],
		promptTitle: 'price value',
		prompt: 'Price should be greater than 0',
	});
	worksheetProductdetails.dataValidations.add('E2:E9999', {
		type: 'decimal',
		operator: 'greaterThan',
		showErrorMessage: true,
		allowBlank: true,
		formulae: [0],
		promptTitle: 'Minimum Advertisable Price value',
		prompt: 'Minimum Advertisable Price value should be greater than 0',
	});
	worksheetProductdetails.dataValidations.add('F2:F9999', {
		type: 'list',
		showErrorMessage: true,
		allowBlank: true,
		formulae: [`"${sheetConfig.product_price_category}"`],
		promptTitle: 'Price Category value',
		prompt: 'Pick Price Category value from dropdown suggestion list',
	});
	worksheetProductdetails.dataValidations.add('G2:G9999', {
		type: 'list',
		showErrorMessage: true,
		allowBlank: true,
		formulae: [`"${sheetConfig.product_product_type}"`],
		promptTitle: 'Product Type value',
		prompt: 'Pick Product Type value from dropdown suggestion list',
	});
	worksheetProductdetails.dataValidations.add('H2:H9999', {
		type: 'textLength',
		operator: 'between',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [3, 256],
		promptTitle: 'supplier length',
		prompt: 'supplier should be greater than 3 characters',
	});
	worksheetProductdetails.dataValidations.add('I2:I9999', {
		type: 'whole',
		operator: 'greaterThanOrEqual',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [0],
		promptTitle: 'qtyAvailable length',
		prompt: 'Quantity Available should not be less than 0 ',
	});
	worksheetProductdetails.dataValidations.add('J2:J9999', {
		type: 'decimal',
		operator: 'greaterThan',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [0],
		promptTitle: 'Minimum Order Quantity value',
		prompt: 'Minimum Order Quantity value should be greater than 0',
	});
	worksheetProductdetails.dataValidations.add('K2:K9999', {
		type: 'whole',
		operator: 'greaterThan',
		showErrorMessage: true,
		allowBlank: false,
		formulae: [0],
		promptTitle: 'LeadTime value',
		prompt: 'LeadTime value should be greater than 0',
	});
	worksheetProductdetails.dataValidations.add('L2:L9999', {
		type: 'date',
		showErrorMessage: true,
		allowBlank: false,
		promptTitle: 'Fromdate value',
		prompt: 'Fromdate value should be date value',
	});
	worksheetProductdetails.dataValidations.add('M2:M9999', {
		type: 'date',
		showErrorMessage: true,
		allowBlank: false,
		promptTitle: 'To Date value',
		prompt: 'To date value should be date value',
	});
	worksheetProductdetails.dataValidations.add('N2:N9999', {
		type: 'list',
		showErrorMessage: true,
		allowBlank: true,
		formulae: [`"${taxclasses}"`],
		promptTitle: 'Tax Class value',
		prompt: 'Pick Tax Class value from dropdown suggestion list',
	});
	if (productsList) {
		worksheetProductdetails.addRows(productsList);
		return workbook.xlsx.writeBuffer();
	}
	return workbook.xlsx.writeBuffer();
}

async function getExportedProductsList(fileBuffer) {
	let productsList = [];
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(fileBuffer);
	const worksheetProductdetails = workbook.getWorksheet(
		sheetConfig.sheet_names.products_details
	);
	if (!worksheetProductdetails) {
		throw new ApiException({
			message: `No proper Excel sheet found`,
			responseCode: config.response_code.field_validation,
			errorData: {
				message: `No proper Excel file sheet found`,
			},
		});
	}
	worksheetProductdetails.getRow(1).eachCell((cell, colNum) => {
		if (
			cell.value !=
			Object.values(sheetConfig.product_sheet_fields_names)[colNum - 1]
		) {
			throw new ApiException({
				message: `No proper column names`,
				responseCode: config.response_code.field_validation,
				errorData: {
					message: `No proper column names`,
				},
			});
		}
	});
	const productKeys = Object.keys(sheetConfig.product_sheet_fields_names);
	let rowsDetails = worksheetProductdetails.getRows(
		2,
		worksheetProductdetails.rowCount - 1
	);
	if (rowsDetails && rowsDetails.length > 0) {
		rowsDetails.forEach((row) => {
			let product = {};
			row.eachCell((cell, colNum) => {
				product[productKeys[colNum - 1]] = cell.value;
			});
			productsList.push(product);
		});
	}
	return productsList.filter((product) => Object.keys(product).length > 0);
}

module.exports = { getProductExportSheet, getExportedProductsList };
