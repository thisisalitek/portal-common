module.exports = function(dbModel) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		ioType: { type: Number, default: 0 },
		eIntegrator: { type: mongoose.Schema.Types.ObjectId, ref: 'integrators', mdl: dbModel['integrators'], required: false },
		profileId: {
			value: { type: String, default: '', trim: true, enum: ['TEMELSIPARIS'], required: true }
		},
		ID: {
			value: {
				type: String,
				trim: true,
				default: '',
				validate: {
					validator: function(v) {
						if(this.ioType == 0 && v != '' && v.length != 16) {
							return false
						} else {
							return true
						}
					},
					message: 'Siparis numarasi 16 karakter olmalidir veya bos birakiniz.'
				}
			}
		},
		salesOrderId: dbType.valueType,
		uuid: dbType.valueType,
		issueDate: { value: { type: String, required: [true, 'Siparis tarihi gereklidir'] } },
		issueTime: { value: { type: String, default: '00:00:00.0000000+03:00' } },
		orderTypeCode: {
			value: { type: String, default: '', trim: true, enum: ['SATIS'] }
		},
		note: [dbType.valueType],
		requestedInvoiceCurrencyCode: {type:dbType.valueType, default:null},
		documentCurrencyCode: dbType.valueType,
		pricingCurrencyCode: {type:dbType.valueType, default:null},
		taxCurrencyCode: {type:dbType.valueType, default:null},
		customerReference: {type:dbType.valueType, default:null},
		accountingCostCode: {type:dbType.valueType, default:null},
		accountingCost:{type:dbType.valueType, default:null},
		lineCountNumeric: dbType.numberValueType,
		validityPeriod: {type:dbType.periodType, default:null},
		quotationDocumentReference: [dbType.documentReferenceType],
		orderDocumentReference: [dbType.documentReferenceType],
		originatorDocumentReference: [dbType.documentReferenceType],
		catalogueReference: [dbType.documentReferenceType],
		additionalDocumentReference: [dbType.documentReferenceType],
		contract: [dbType.documentReferenceType],
		projectReference: [dbType.documentReferenceType],
		buyerCustomerParty: {
			customerAssignedAccountId: dbType.idType,
			supplierAssignedAccountId: dbType.idType,
			additionalAccountId: dbType.idType,
			party: dbType.partyType,
			deliveryContact: dbType.contactType,
			accountingContact: dbType.contactType,
			buyerContact: dbType.contactType
		},
		sellerSupplierParty: {
			customerAssignedAccountId: dbType.idType,
			additionalAccountId: dbType.idType,
			dataSendingCapability: dbType.valueType,
			party: dbType.partyType,
			despatchContact: dbType.contactType,
			accountingContact: dbType.contactType,
			sellerContact: dbType.contactType
		},
		originatorCustomerParty: {
			type: {
				customerAssignedAccountId: dbType.idType,
				supplierAssignedAccountId: dbType.idType,
				additionalAccountId: dbType.idType,
				party: dbType.partyType,
				deliveryContact: dbType.contactType,
				accountingContact: dbType.contactType,
				buyerContact: dbType.contactType
			},
			default: null
		},
		freightForwarderParty: {type:Object, default:null},
		accountingCustomerParty: {
			type: {
				customerAssignedAccountId: dbType.idType,
				supplierAssignedAccountId: dbType.idType,
				additionalAccountId: dbType.idType,
				party: dbType.partyType,
				deliveryContact: dbType.contactType,
				accountingContact: dbType.contactType,
				buyerContact: dbType.contactType
			},
			default: null
		},
		delivery: [dbType.deliveryType],
		deliveryTerms: [dbType.deliveryTermsType],
		paymentMeans: [dbType.paymentMeansType],
		paymentTerms: [dbType.paymentTermsType],
		transactionConditions: {type:dbType.transactionConditionsType, default:null},
		allowanceCharge: [dbType.allowanceChargeType],
		taxExchangeRate: {type:dbType.exchangeRateType,default:null},
		pricingExchangeRate: {type:dbType.exchangeRateType,default:null},
		paymentExchangeRate: {type:dbType.exchangeRateType,default:null},
		paymentAlternativeExchangeRate:{type: dbType.exchangeRateType,default:null},
		destinationCountry:{type: dbType.countryType,default:null},
		taxTotal: dbType.taxTotalType,
		withholdingTaxTotal: { type: dbType.taxTotalType, default: null },
		anticipatedMonetaryTotal: dbType.monetaryTotalType,
		orderLine: [dbType.orderLineType],
		localDocumentId: { type: String, default: '' },
		orderStatus: { type: String, default: 'Draft', enum: ['Deleted', 'Pending', 'Draft', 'Canceled', 'Queued', 'Pending', 'Queued', 'Processing', 'Sent', 'Approved', 'Declined', 'WaitingForApprovement', 'Error'] },
		orderErrors: [{ _date: { type: Date, default: Date.now }, code: '', message: '' }],
		localStatus: { type: String, default: '', enum: ['', 'transferring', 'pending', 'transferred', 'error'] },
		localErrors: [{ _date: { type: Date, default: Date.now }, code: '', message: '' }],
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now }
	})



	schema.pre('save', (next) => {
		next()
	})
	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => {})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	schema.index({ 'ioType': 1 })
	schema.index({ 'ID.value': 1, })
	schema.index({ 'issueDate.value': 1 })
	schema.index({ 'uuid.value': 1 })
	schema.index({ 'eIntegrator': 1 })
	schema.index({ 'profileId.value': 1 })
	schema.index({ 'orderTypeCode.value': 1 })
	schema.index({ 'documentCurrencyCode.value': 1 })
	schema.index({ 'localDocumentId': 1 })
	schema.index({ 'orderStatus': 1 })
	schema.index({ 'localStatus': 1 })
	schema.index({ 'createdDate': 1 })
	

	let model = dbModel.conn.model(collectionName, schema)
	model.removeOne = (member, filter, cb) => { sendToTrash(dbModel, collectionName, member, filter, cb) }

	return model
}