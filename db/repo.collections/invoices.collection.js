module.exports = function(dbModel) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		ioType: { type: Number, default: 0 },
		eIntegrator: { type: mongoose.Schema.Types.ObjectId, ref: 'integrators', mdl: dbModel['integrators'], required: true },
		location: { type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl: dbModel['locations'], default: null },
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
							return false
						} else {
							return true
						}
					},
					message: 'Fatura numarasi 16 karakter olmalidir veya bos birakiniz.'
				}
			}
		},
		uuid: dbType.valueType,
		issueDate: { value: { type: String, required: [true, 'Fatura tarihi gereklidir'] } },
		issueTime: { value: { type: String, default: '00:00:00.0000000+03:00' } },
		invoiceTypeCode: {
			value: {
				type: String,
				default: '',
				trim: true,
				enum: ['SATIS', 'IADE', 'TEVKIFAT', 'ISTISNA', 'OZELMATRAH', 'IHRACKAYITLI'],
				validate: {
					validator: (v) => {
						if(this.ioType == 0 && (this.profileId == 'IHRACAT' || this.profileId == 'YOLCUBERABERFATURA') && v != 'ISTISNA') {
							return false
						} else {
							return true
						}
					},
					message: 'Senaryo: IHRACAT veya YOLCUBERABERFATURA oldugunda fatura turu ISTISNA olarak secilmelidir.'
				}
			}
		},
		invoicePeriod: dbType.periodType,
		note: [dbType.valueType],
		documentCurrencyCode: dbType.valueType,
		taxCurrencyCode: dbType.valueType,
		pricingCurrencyCode: dbType.valueType,
		paymentCurrencyCode: dbType.valueType,
		paymentAlternativeCurrencyCode: dbType.valueType,
		lineCountNumeric: dbType.numberValueType,
		additionalDocumentReference: [dbType.documentReferenceType],
		orderReference: [dbType.orderReferenceType],
		despatchDocumentReference: [dbType.documentReferenceType],
		originatorDocumentReference: [dbType.documentReferenceType],
		accountingSupplierParty: {
			party: dbType.partyType,
			despatchContact: dbType.contactType
		},
		accountingCustomerParty: {
			party: dbType.partyType,
			deliveryContact: dbType.contactType
		},
		sellerSupplierParty: {
			party: dbType.partyType,
			despatchContact: dbType.contactType
		},
		buyerCustomerParty: {
			party: dbType.partyType,
			deliveryContact: dbType.contactType
		},
		accountingCost: dbType.valueType,
		delivery: [dbType.deliveryType],
		billingReference: [dbType.billingReferenceType],
		contractDocumentReference: [dbType.documentReferenceType],
		paymentTerms: dbType.paymentTermsType,
		paymentMeans: [dbType.paymentMeansType],
		taxExchangeRate: dbType.exchangeRateType,
		pricingExchangeRate: dbType.exchangeRateType,
		paymentExchangeRate: dbType.exchangeRateType,
		paymentAlternativeExchangeRate: dbType.exchangeRateType,
		taxTotal: dbType.taxTotalType,
		withholdingTaxTotal: dbType.taxTotalType,
		allowanceCharge: [dbType.allowanceChargeType],
		legalMonetaryTotal: {
			lineExtensionAmount: dbType.amountType,
			taxExclusiveAmount: dbType.amountType,
			taxInclusiveAmount: dbType.amountType,
			allowanceTotalAmount: dbType.amountType,
			chargeTotalAmount: dbType.amountType,
			payableRoundingAmount: dbType.amountType,
			payableAmount: dbType.amountType
		},
		invoiceLine: [dbType.invoiceLineType],
		pdf: { type: mongoose.Schema.Types.ObjectId, ref: 'files', mdl: dbModel['files'], default: null },
		html: { type: mongoose.Schema.Types.ObjectId, ref: 'files', mdl: dbModel['files'], default: null },
		localDocumentId: { type: String, default: '' },
		invoiceStatus: { type: String, default: 'Draft', enum: ['Draft', 'Pending', 'Queued', 'Processing', 'SentToGib', 'Approved', 'Declined', 'WaitingForApprovement', 'Error'] },
		invoiceErrors: [{
			_date: { type: Date, default: Date.now },
			code: '',
			message: ''
		}],
		localStatus: { type: String, default: '', enum: ['', 'transferring', 'pending', 'transferred', 'error'] },
		localErrors: [{ _date: { type: Date, default: Date.now }, code: '', message: '' }],
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now }
	})

	schema.pre('save', (next) => { next() })

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
	schema.index({ 'invoiceTypeCode.value': 1 })
	schema.index({ 'documentCurrencyCode.value': 1 })
	schema.index({ 'localDocumentId': 1 })
	schema.index({ 'invoiceStatus': 1 })
	schema.index({ 'localStatus': 1 })
	schema.index({ 'createdDate': 1 })


	let model = dbModel.conn.model(collectionName, schema)

	model.removeOne = (member, filter, cb) => { sendToTrash(dbModel, collectionName, member, filter, cb) }

	return model
}