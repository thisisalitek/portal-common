const mongoose = require('mongoose');

const valueType = { value: { type: String, trim: true, default: '' } }

const idType = { value: { type: String, trim: true, default: '' }, attr: { schemeID: { type: String, trim: true, default: '' } } }

const numberValueType = { value: { type: Number, default: 0 } }
const booleanValueType = { value: { type: Boolean, default: false } }
const amountType = { value: { type: Number, default: 0 }, attr: { currencyID: { type: String, trim: true, default: '' } } }
const quantityType = { value: { type: Number, default: 0 }, attr: { unitCode: { type: String, trim: true, default: '' } } }
const measureType = { value: { type: Number, default: 0 }, attr: { unitCode: { type: String, trim: true, default: '' } } }
const codeType = { value: { type: String, trim: true, default: '' }, attr: { name: { type: String, trim: true, default: '' } } }

const countryType = {
	identificationCode: valueType,
	name: valueType
}
const periodType = {
	startDate: valueType,
	startTime: valueType,
	endDate: valueType,
	endTime: valueType,
	description: valueType,
	durationMeasure: quantityType
}

const partyIdentificationType = { ID: { value: { type: String, trim: true, default: '' }, attr: { schemeID: { type: String, trim: true, default: 'VKN' } } } }

const documentReferenceType = {
	ID: idType,
	issueDate: valueType,
	documentTypeCode: valueType,
	documentType: valueType,
	documentDescription: [valueType],
	attachment: {
		embeddedDocumentBinaryObject: {
			value: { type: String, default: '' },
			attr: {
				format: { type: String },
				mimeCode: { type: String, trim: true, default: 'application/xml' },
				encodingCode: { type: String, trim: true, default: 'Base64' },
				characterSetCode: { type: String, trim: true, default: 'UTF-8' },
				filename: { type: String, default: 'xslt_sablon.xslt' }
			}
		}
	},
	validityPeriod: periodType
}

const orderReferenceType = {
	ID: idType,
	issueDate: valueType,
	orderTypeCode: valueType,
	salesOrderId: idType,
	documentReference: documentReferenceType
}

const contactType = {
	ID: idType,
	name: valueType,
	note: valueType,
	telephone: valueType,
	telefax: valueType,
	electronicMail: valueType,
	otherCommunication: [valueType]
}

const financialAccountType = {
	currencyCode: valueType,
	financialInstitutionBranch: {
		financialInstitution: { name: valueType },
		name: valueType
	},
	ID: idType,
	paymentNote: valueType
}


const personType = {
	firstName: valueType,
	middleName: valueType,
	familyName: valueType,
	nameSuffix: valueType,
	title: valueType,
	financialAccount: financialAccountType,
	identityDocumentReference: documentReferenceType,
	nationalityId: idType
}

const addressType = {
	room: valueType,
	streetName: valueType,
	blockName: valueType,
	buildingName: valueType,
	buildingNumber: valueType,
	citySubdivisionName: valueType,
	cityName: valueType,
	postalZone: valueType,
	postbox: valueType,
	region: valueType,
	district: valueType,
	country: countryType
}

const partyType = {
	_id: { type: mongoose.Schema.Types.ObjectId, ref: 'parties' },
	// partyId:{type: mongoose.Schema.Types.ObjectId, ref: 'parties'},
	partyType: '',
	websiteURI: valueType,
	partyIdentification: [partyIdentificationType],
	partyName: { name: valueType },
	postalAddress: addressType,
	partyTaxScheme: {
		taxScheme: {
			name: valueType,
			taxTypeCode: idType
		}
	},
	contact: contactType,
	person: personType
}

const exchangeRateType = {
	sourceCurrencyCode: valueType,
	targetCurrencyCode: valueType,
	calculationRate: numberValueType,
	date: valueType
}

const actualPackageType = {
	ID: idType,
	quantity: quantityType,
	packagingTypeCode: valueType
}

const dimensionType = {
	attributeId: idType,
	description: [valueType],
	measure: quantityType,
	minimumMeasure: quantityType,
	maximumMeasure: quantityType
}

const itemPropertyType = {
	ID: idType,
	importanceCode: valueType,
	itemPropertyGroup: [{
		ID: idType,
		importanceCode: valueType,
		name: valueType
	}],
	name: valueType,
	nameCode: valueType,
	rangeDimension: dimensionType,
	value: valueType,
	valueQuantity: quantityType,
	valueQualifier: [valueType],
	usabilityPeriod: periodType
}

const itemInstanceType = {
	additionalItemProperty: [itemPropertyType],
	serialId: idType,
	lotIdentification: {
		lotNumberId: idType,
		expiryDate: valueType,
		additionalItemProperty: [itemPropertyType]
	},
	manufactureDate: valueType,
	manufactureTime: valueType,
	productTraceId: idType,
	registrationId: idType
}



const itemType = {
	_id: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
	itemType: '',
	name: valueType,
	description: valueType,
	additionalItemIdentification: [], //{ID:idType}
	brandName: valueType,
	buyersItemIdentification: { ID: idType },
	commodityClassification: [{
		itemClassificationCode: valueType
	}],
	keyword: valueType,
	manufacturersItemIdentification: { ID: idType },
	modelName: valueType,
	sellersItemIdentification: { ID: idType },
	originCountry: countryType,
	itemInstance: [], //itemInstanceType
}

const paymentTermsType = {
	amount: amountType,
	note: valueType,
	paymentDueDate: valueType,
	penaltyAmount: amountType,
	penaltySurchargePercent: numberValueType,
	settlementPeriod: periodType

}


const paymentMeansType = {
	instructionNote: valueType,
	paymentMeansCode: codeType,
	paymentChannelCode: codeType,
	paymentDueDate: valueType,
	payerFinancialAccount: financialAccountType,
	payeeFinancialAccount: financialAccountType
}

const taxTotalType = {
	taxAmount: amountType,
	taxSubtotal: [{
		taxableAmount: optional(amountType),
		taxAmount: amountType,
		percent: optional(numberValueType),
		calculationSequenceNumeric: optional(numberValueType),
		taxCategory: {
			name: optional(valueType),
			taxScheme: {
				ID: optional(idType),
				name: valueType,
				taxTypeCode: valueType
			},
			taxExemptionReason: optional(valueType),
			taxExemptionReasonCode: optional(valueType)
		}
	}]
}

const allowanceChargeType = {
	chargeIndicator: booleanValueType,
	sequenceNumeric: optional(numberValueType),
	allowanceChargeReason: optional(valueType),
	amount: amountType,
	baseAmount: optional(amountType),
	multiplierFactorNumeric: optional(numberValueType),
	perUnitAmount: optional(amountType)
}

const lineReferencetype = {
	documentReference: documentReferenceType,
	lineId: idType,
	lineStatusCode: valueType
}

const orderLineReferenceType = {
	lineId: idType,
	lineStatusCode: valueType,
	salesOrderLineId: idType,
	uuid: valueType,
	orderReference: {
		ID: idType,
		documentReference: documentReferenceType,
		issueDate: valueType,
		orderTypeCode: valueType,
		salesOrderId: idType
	}
}

const locationType = {
	ID: idType,
	address: addressType
}

const deliveryTermsType = {
	amount: amountType,
	ID: {
		value: { type: String, trim: true, default: '' },
		attr: { schemeID: { type: String, default: 'INCOTERMS' } }
	},
	specialTerms: valueType
}

const despatchType = {
	ID: idType,
	actualDespatchDate: valueType,
	actualDespatchTime: valueType,
	contact: contactType,
	despatchAddress: addressType,
	despatchParty: partyType,
	estimatedDespatchPeriod: periodType,
	instructions: valueType
}


const temperatureType = {
	attributeId: valueType,
	description: [valueType],
	measure: measureType
}

const goodsItemType = {
	ID: idType, //*** ihracatta zorunlu alan
	requiredCustomsId: idType, //*** ihracatta zorunlu alan
	chargeableQuantity: quantityType,
	chargeableWeightMeasure: measureType,
	customsImportClassifiedIndicator: booleanValueType,
	customsStatusCode: codeType,
	customsTariffQuantity: quantityType,
	declaredCustomsValueAmount: amountType,
	declaredForCarriageValueAmount: amountType,
	declaredStatisticsValueAmount: amountType,
	description: valueType,
	freeOnBoardValueAmount: amountType,
	freightAllowanceCharge: [], //allowanceChargeType
	grossVolumeMeasure: measureType,
	grossWeightMeasure: measureType,
	hazardousRiskIndicator: booleanValueType,
	insuranceValueAmount: amountType,
	invoiceLine: [],
	item: [], //itemType
	measurementDimension: [dimensionType],
	NetVolumeMeasure: measureType,
	NetWeightMeasure: measureType,
	OriginAddress: addressType,
	quantity: quantityType,
	returnableQuantity: quantityType,
	temperature: [], //temperatureType
	traceId: idType,
	valueAmount: amountType
}

const customsDeclarationType = {
	ID: idType,
	issuerParty: partyType
}

const hazardousGoodsTransitType = {
	hazardousRegulationCode: codeType,
	inhalationToxicityZoneCode: codeType,
	maximumTemperature: temperatureType,
	minimumTemperature: temperatureType,
	packingCriteriaCode: codeType,
	transportAuthorizationCode: codeType,
	transportEmergencyCardCode: codeType

}

const transportEquipmentType = {
	ID: idType,
	description: valueType,
	transportEquipmentTypeCode: codeType
}

const maritimeTransportType = {
	grossTonnageMeasure: measureType,
	netTonnageMeasure: measureType,
	radioCallSignId: idType,
	registryCertificateDocumentReference: documentReferenceType,
	registryPortLocation: locationType,
	shipsRequirements: [valueType],
	vesselId: idType,
	vesselName: valueType
}

const railTransportType = {
	railCarId: idType,
	trainId: idType
}

const roadTransportType = {
	licensePlateId: idType,
	LocationId: idType
}

const stowageType = {
	location: [locationType],
	locationId: idType,
	measurementDimension: [dimensionType]
}

const transportMeansType = {
	airTransport: {
		aircraftId: idType
	},
	directionCode: codeType,
	journeyId: idType,
	maritimeTransport: maritimeTransportType,
	measurementDimension: [dimensionType],
	ownerParty: partyType,
	railTransport: railTransportType,
	registrationNationality: [valueType],
	registrationNationalityId: idType,
	roadTransport: roadTransportType,
	stowage: stowageType,
	tradeServiceCode: codeType,
	transportMeansTypeCode: codeType
}

const transportHandlingUnitType = {
	ID: idType,
	actualPackage: [{ //*** ihracatta zorunlu alan
		ID: idType, //*** ihracatta zorunlu alan
		quantity: quantityType, //*** ihracatta zorunlu alan
		packagingTypeCode: codeType //*** ihracatta zorunlu alan
	}],
	customsDeclaration: [customsDeclarationType],
	floorSpaceMeasurementDimension: dimensionType,
	minimumTemperature: temperatureType,
	maximumTemperature: temperatureType,
	damageRemarks: [valueType],
	handlingCode: codeType,
	handlingInstructions: valueType,
	hazardousGoodsTransit: [hazardousGoodsTransitType],
	measurementDimension: [dimensionType],
	palletSpaceMeasurementDimension: dimensionType,
	shipmentDocumentReference: [documentReferenceType],
	totalGoodsItemQuantity: quantityType,
	totalPackageQuantity: quantityType,
	traceId: idType,
	transportEquipment: [transportEquipmentType],
	transportHandlingUnitTypeCode: codeType,
	transportMeans: [transportMeansType]
}

const shipmentStageType = {
	driverPerson: [personType],
	transportModeCode: codeType
}


const deliveryType = {
	ID: idType,
	quantity: quantityType,
	actualDeliveryDate: valueType,
	actualDeliveryTime: valueType,
	latestDeliveryDate: valueType,
	latestDeliveryTime: valueType,
	trackingId: valueType,
	deliveryAddress: addressType,
	alternativeDeliveryLocation: locationType,
	estimatedDeliveryPeriod: periodType,
	carrierParty: partyType,
	deliveryParty: partyType,
	despatch: {},
	deliveryTerms: [],
	shipment: {}
}


const shipmentType = {
	ID: idType,
	declaredCustomsValueAmount: amountType,
	declaredForCarriageValueAmount: amountType,
	declaredStatisticsValueAmount: amountType,
	delivery: deliveryType,
	firstArrivalPortLocation: locationType,
	freeOnBoardValueAmount: amountType,
	goodsItem: [], //[goodsItemType]
	grossVolumeMeasure: quantityType,
	grossWeightMeasure: quantityType,
	handlingCode: valueType,
	handlingInstructions: valueType,
	insuranceValueAmount: amountType,
	lastExitPortLocation: locationType,
	netVolumeMeasure: quantityType,
	netWeightMeasure: quantityType,
	returnAddress: addressType,
	shipmentStage: [], //[shipmentStageType]
	specialInstructions: [], //[valueType]
	totalGoodsItemQuantity: quantityType,
	totalTransportHandlingUnitQuantity: quantityType,
	transportHandlingUnit: [] //[transportHandlingUnitType]
}

const invoiceLineType = {
	ID: idType,
	note: [valueType],
	invoicedQuantity: quantityType,
	price: {
		priceAmount: amountType
	},
	lineExtensionAmount: amountType,
	orderLineReference: [orderLineReferenceType],
	item: itemType,
	receiptLineReference: [lineReferencetype],
	allowanceCharge: [allowanceChargeType],
	delivery: [deliveryType],
	despatchLineReference: [lineReferencetype],
	taxTotal: optional(taxTotalType),
	withholdingTaxTotal: optional(taxTotalType),
	subInvoiceLine: []
}

const orderLineType = {
	ID: idType,
	salesOrderLineId: idType,
	note: [valueType],
	orderedQuantity: quantityType,
	producedQuantity: optional(quantityType),
	deliveredQuantity: optional(quantityType),
	price: {
		priceAmount: amountType
	},
	lineExtensionAmount: amountType,
	item: itemType,
	allowanceCharge: [allowanceChargeType],
	delivery: [deliveryType],
	taxTotal: optional(taxTotalType),
	withholdingTaxTotal: optional(taxTotalType),
	subOrderLine: []
}

const billingReferenceLineType = {
	ID: idType,
	amount: amountType,
	allowanceCharge: [allowanceChargeType]
}
const billingReferenceType = {
	additionalDocumentReference: documentReferenceType,
	billingReferenceLine: [billingReferenceLineType],
	debitNoteDocumentReference: documentReferenceType,
	creditNoteDocumentReference: documentReferenceType,
	invoiceDocumentReference: documentReferenceType,
	reminderDocumentReference: documentReferenceType,
	selfBilledCreditNoteDocumentReference: documentReferenceType,
	selfBilledInvoiceDocumentReference: documentReferenceType
}


const despatchLineType = {
	ID: idType,
	item: itemType,
	note: [], //valueType
	deliveredQuantity: quantityType,
	documentReference: [], //documentReferenceType
	orderLineReference: orderLineReferenceType,
	outstandingQuantity: quantityType,
	outstandingReason: [], //valueType
	oversupplyQuantity: quantityType,
	shipment: [] //shipmentType
}

const receiptLineType = {
	ID: idType,
	item: itemType,
	note: [valueType],
	receivedDate: valueType,
	despatchLineReference: lineReferencetype,
	receivedQuantity: quantityType,
	rejectedQuantity: quantityType,
	rejectReason: [valueType],
	rejectReasonCode: codeType,
	shortQuantity: quantityType,
	documentReference: [documentReferenceType],
	orderLineReference: orderLineReferenceType,
	oversupplyQuantity: quantityType,
	timingComplaint: valueType,
	timingComplaintCode: codeType,
	shipment: [shipmentType]
}

const transactionConditionsType = {
	ID: idType,
	actionCode: codeType,
	description: [valueType],
	documentReference: [documentReferenceType]
}

const invoiceType = {
	ioType: { type: Number, default: 0 }, // 0 - cikis , 1- giris
	eIntegrator: { type: mongoose.Schema.Types.ObjectId, ref: 'integrators', required: true },
	location: { type: mongoose.Schema.Types.ObjectId, ref: 'locations', required: true },
	profileId: {
		value: { type: String, default: '', trim: true, enum: ['TEMELFATURA', 'TICARIFATURA', 'IHRACAT', 'YOLCUBERABERFATURA', 'EARSIVFATURA'], required: true }
	},
	ID: {
		value: {
			type: String,
			trim: true,
			default: '',
			validate: {
				validator: function(v) {
					if(this.ioType == 0 && v != '' && v.length != 16) {
						return false;
					} else {
						return true;
					}
				},
				message: 'Fatura numarasi 16 karakter olmalidir veya bos birakiniz.'
			}
		}
	},
	uuid: valueType,
	issueDate: { value: { type: String, required: [true, 'Fatura tarihi gereklidir'] } },
	issueTime: { value: { type: String, default: '00:00:00.0000000+03:00' } },
	invoiceTypeCode: {
		value: {
			type: String,
			default: '',
			trim: true,
			enum: ['SATIS', 'IADE', 'TEVKIFAT', 'ISTISNA', 'OZELMATRAH', 'IHRACKAYITLI'],
			validate: {
				validator: function(v) {
					if(this.ioType == 0 && (this.profileId == 'IHRACAT' || this.profileId == 'YOLCUBERABERFATURA') && v != 'ISTISNA') {
						return false;
					} else {
						return true;
					}
				},
				message: 'Senaryo: IHRACAT veya YOLCUBERABERFATURA oldugunda fatura turu ISTISNA olarak secilmelidir.'
			}
		}
	},
	invoicePeriod: periodType,
	note: [valueType],
	documentCurrencyCode: valueType,
	taxCurrencyCode: valueType,
	pricingCurrencyCode: valueType,
	paymentCurrencyCode: valueType,
	paymentAlternativeCurrencyCode: valueType,
	lineCountNumeric: numberValueType,
	additionalDocumentReference: [documentReferenceType],
	orderReference: [orderReferenceType],
	despatchDocumentReference: [documentReferenceType],
	originatorDocumentReference: [documentReferenceType],
	accountingSupplierParty: {
		party: partyType,
		despatchContact: contactType
	},
	accountingCustomerParty: {
		party: partyType,
		deliveryContact: contactType
	},
	sellerSupplierParty: {
		party: partyType,
		despatchContact: contactType
	},
	buyerCustomerParty: {
		party: partyType,
		deliveryContact: contactType
	},
	accountingCost: valueType,
	delivery: [deliveryType],
	billingReference: [billingReferenceType],
	contractDocumentReference: [documentReferenceType],
	paymentTerms: paymentTermsType,
	paymentMeans: [paymentMeansType],
	taxExchangeRate: exchangeRateType,
	pricingExchangeRate: exchangeRateType,
	paymentExchangeRate: exchangeRateType,
	paymentAlternativeExchangeRate: exchangeRateType,
	taxTotal: [taxTotalType],
	withholdingTaxTotal: [taxTotalType],
	allowanceCharge: [allowanceChargeType],
	legalMonetaryTotal: {
		lineExtensionAmount: amountType,
		taxExclusiveAmount: amountType,
		taxInclusiveAmount: amountType,
		allowanceTotalAmount: amountType,
		chargeTotalAmount: amountType,
		payableRoundingAmount: amountType,
		payableAmount: amountType
	},
	invoiceLine: [invoiceLineType],
	localDocumentId: { type: String, default: '' }
}

const actionType = {
	connId: null,
	actionType: '',
	actionCode: '',
	issueDate: '',
	issueTime: '',
	ioType: -1,
	docId: null,
	docNo: '',
	description: '',
	inventory: {
		locationId: null,
		locationId2: null,
		itemId: null,
		quantity: 0,
		quantity2: 0,
		quantity3: 0,
		unitCode: ''
	},
	party: {
		partyId: null,
		amount: 0,
		currencyID: '',
		exchangeRate: 0,
		currencyAmount: 0
	},
	bank: {
		bankId: null,
		amount: 0,
		currencyID: '',
		exchangeRate: 0,
		currencyAmount: 0
	},
	cash: {
		cashSafeId: null,
		amount: 0,
		currencyID: '',
		exchangeRate: 0,
		currencyAmount: 0
	},
	person: {
		personId: null,
		amount: 0,
		currencyID: '',
		exchangeRate: 0,
		currencyAmount: 0
	}

}

const receiptAdviceLineInfoType = {
	lineId: valueType,
	timingComplaint: valueType,
	receivedQuantity: quantityType,
	rejectedQuantity: quantityType,
	rejectReason: valueType,
	rejectReasonCode: codeType,
	shortQuantity: quantityType,
	oversupplyQuantity: quantityType
}

const monetaryTotalType = {
	lineExtensionAmount: amountType,
	taxExclusiveAmount: amountType,
	taxInclusiveAmount: amountType,
	allowanceTotalAmount: optional(amountType),
	chargeTotalAmount: optional(amountType),
	prepaidAmount: optional(amountType),
	payableRoundingAmount: optional(amountType),
	payableAmount: amountType,
	payableAlternativeAmount: optional(amountType)
}


function optional(objType) {

	return { type: objType, default: null }
}

module.exports = Object.freeze({
	valueType: valueType,
	idType: idType,
	numberValueType: numberValueType,
	amountType: amountType,
	quantityType: quantityType,
	codeType: codeType,
	measureType: measureType,
	countryType: countryType,
	partyIdentificationType: partyIdentificationType,
	partyType: partyType,
	exchangeRateType: exchangeRateType,
	actualPackageType: actualPackageType,
	dimensionType: dimensionType,
	itemPropertyType: itemPropertyType,
	itemInstanceType: itemInstanceType,
	documentReferenceType: documentReferenceType,
	orderReferenceType: orderReferenceType,
	contactType: contactType,
	personType: personType,
	itemType: itemType,
	paymentTermsType: paymentTermsType,
	paymentMeansType: paymentMeansType,
	exchangeRateType: exchangeRateType,
	taxTotalType: taxTotalType,
	financialAccountType: financialAccountType,
	allowanceChargeType: allowanceChargeType,
	periodType: periodType,
	lineReferencetype: lineReferencetype,
	orderLineReferenceType: orderLineReferenceType,
	deliveryType: deliveryType,
	addressType: addressType,
	locationType: locationType,
	despatchType: despatchType,
	shipmentType: shipmentType,
	customsDeclarationType: customsDeclarationType,
	transportHandlingUnitType: transportHandlingUnitType,
	dimensionType: dimensionType,
	temperatureType: temperatureType,
	hazardousGoodsTransitType: hazardousGoodsTransitType,
	transportEquipmentType: transportEquipmentType,
	transportMeansType: transportMeansType,
	maritimeTransportType: maritimeTransportType,
	railTransportType: railTransportType,
	roadTransportType: roadTransportType,
	stowageType: stowageType,
	invoiceLineType: invoiceLineType,
	shipmentStageType: shipmentStageType,
	billingReferenceType: billingReferenceType,
	billingReferenceLineType: billingReferenceLineType,
	despatchLineType: despatchLineType,
	receiptLineType: receiptLineType,
	orderLineType: orderLineType,
	transactionConditionsType: transactionConditionsType,
	deliveryTermsType: deliveryTermsType,
	invoiceType: invoiceType,
	actionType: actionType,
	monetaryTotalType: monetaryTotalType
});