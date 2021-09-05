module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		ioType :{ type: Number,default: 0},
		eIntegrator: {type: mongoose.Schema.Types.ObjectId, ref: 'integrators', mdl:dbModel['integrators'], required: false},
		profileId: { 
			value: { type: String,default: '', trim:true, enum:['TEMELSIPARIS'], required: true}
		},
		ID: {
			value: {
				type: String, trim:true, default: '',
				validate: {
					validator: function(v) {
						if(this.ioType==0 && v!='' && v.length!=16){
							return false
						}else{
							return true
						}
					},
					message: 'Siparis numarasi 16 karakter olmalidir veya bos birakiniz.'
				}
			}
		},
		salesOrderId:dbType.valueType,
		uuid: dbType.valueType,
		issueDate: {value :{ type: String,  required: [true,'Siparis tarihi gereklidir']}},
		issueTime: {value :{ type: String,default: '00:00:00.0000000+03:00'}},
		orderTypeCode: {
			value:{ type: String,default: '', trim:true, enum:['SATIS']}
		},
		note:[dbType.valueType],
		requestedInvoiceCurrencyCode:dbType.valueType,
		documentCurrencyCode:dbType.valueType,
		pricingCurrencyCode:dbType.valueType,
		taxCurrencyCode:dbType.valueType,
		customerReference:dbType.valueType,
		accountingCostCode:dbType.valueType,
		accountingCost:dbType.valueType,
		lineCountNumeric:dbType.numberValueType,
		validityPeriod: dbType.periodType,
		quotationDocumentReference:[dbType.documentReferenceType],
		orderDocumentReference:[dbType.documentReferenceType],
		originatorDocumentReference:[dbType.documentReferenceType],
		catalogueReference:[dbType.documentReferenceType],
		additionalDocumentReference:[dbType.documentReferenceType],
		contract:[dbType.documentReferenceType],
		projectReference:[dbType.documentReferenceType],
		buyerCustomerParty:{
			customerAssignedAccountId:dbType.idType,
			supplierAssignedAccountId:dbType.idType,
			additionalAccountId:dbType.idType,
			party:dbType.partyType,
			deliveryContact:dbType.contactType,
			accountingContact:dbType.contactType,
			buyerContact:dbType.contactType
		},
		sellerSupplierParty:{
			customerAssignedAccountId:dbType.idType,
			additionalAccountId:dbType.idType,
			dataSendingCapability:dbType.valueType,
			party:dbType.partyType,
			despatchContact:dbType.contactType,
			accountingContact:dbType.contactType,
			sellerContact:dbType.contactType
		},
		originatorCustomerParty:{
			customerAssignedAccountId:dbType.idType,
			supplierAssignedAccountId:dbType.idType,
			additionalAccountId:dbType.idType,
			party:dbType.partyType,
			deliveryContact:dbType.contactType,
			accountingContact:dbType.contactType,
			buyerContact:dbType.contactType
		},
		freightForwarderParty :{}, 
		accountingCustomerParty:{
			customerAssignedAccountId:dbType.idType,
			supplierAssignedAccountId:dbType.idType,
			additionalAccountId:dbType.idType,
			party:dbType.partyType,
			deliveryContact:dbType.contactType,
			accountingContact:dbType.contactType,
			buyerContact:dbType.contactType
		},
		delivery:[dbType.deliveryType],
		deliveryTerms:[dbType.deliveryTermsType],
		paymentMeans:[dbType.paymentMeansType],
		paymentTerms:[dbType.paymentTermsType],
		transactionConditions:dbType.transactionConditionsType,
		allowanceCharge:[dbType.allowanceChargeType],
		taxExchangeRate:dbType.exchangeRateType,
		pricingExchangeRate:dbType.exchangeRateType,
		paymentExchangeRate:dbType.exchangeRateType,
		paymentAlternativeExchangeRate:dbType.exchangeRateType,
		destinationCountry:dbType.countryType,
		taxTotal:[dbType.taxTotalType],
		withholdingTaxTotal:[dbType.taxTotalType],
		anticipatedMonetaryTotal : { 
			lineExtensionAmount  :dbType.amountType,
			taxExclusiveAmount  : dbType.amountType,
			taxInclusiveAmount   : dbType.amountType,
			allowanceTotalAmount   : dbType.amountType,
			chargeTotalAmount : dbType.amountType,
			prepaidAmount : dbType.amountType,
			payableRoundingAmount : dbType.amountType,
			payableAmount :dbType.amountType,
			payableAlternativeAmount :dbType.amountType
		},
		orderLine:[dbType.orderLineType],
		localDocumentId: {type: String, default: ''},
		orderStatus: {type: String, default: 'Draft',enum:['Deleted','Pending','Draft','Canceled','Queued','Pending','Queued', 'Processing','Sent','Approved','Declined','WaitingForApprovement','Error']},
		orderErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
		localStatus: {type: String, default: '',enum:['','transferring','pending','transferred','error']},
		localErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now}
	})



schema.pre('save', (next)=>{
	if(this.orderLine){
		this.lineCountNumeric.value=this.orderLine.length
	}
	next()
})
schema.pre('remove', (next)=>next())
schema.pre('remove', true, (next, done)=>next())
schema.on('init', (model)=>{})
schema.plugin(mongoosePaginate)
schema.plugin(mongooseAggregatePaginate)

schema.index({
	"ioType":1,
	"ID.value":1,
	"issueDate.value":1,
	"uuid.value":1,
	"eIntegrator":1,
	"profileId.value":1,
	"orderTypeCode.value":1,
	"documentCurrencyCode.value":1,
	"localDocumentId":1,
	"orderStatus":1,
	"localStatus":1,
	"createdDate":1
})


let model=dbModel.conn.model(collectionName, schema)
model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }

return model
}
