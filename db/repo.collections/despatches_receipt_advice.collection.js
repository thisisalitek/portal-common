module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		ioType :{ type: Number,default: 1}, 
		despatch: {type: mongoose.Schema.Types.ObjectId, required: true},
		eIntegrator: {type: mongoose.Schema.Types.ObjectId, ref: 'integrators', mdl:dbModel['integrators'], required: true},
		profileId: {
			value: { type: String,default: '', trim:true, enum:['TEMELIRSALIYE'], required: true}
		},
		ID: dbType.idType,
		uuid: dbType.valueType,
		issueDate: {value :{ type: String,  required: [true,'Teslim tarihi gereklidir']}},
		issueTime: {value :{ type: String,default: '00:00:00'}},
		receiptAdviceTypeCode: {value: { type: String,default: '', trim:true, enum:['SEVK','MATBUDAN'], required: true}},
		note:[dbType.valueType],
		despatchDocumentReference:dbType.documentReferenceType,
		additionalDocumentReference:[dbType.documentReferenceType],
		orderReference:[dbType.orderReferenceType],
		originatorDocumentReference:[dbType.documentReferenceType],
		despatchSupplierParty:{
			party:dbType.partyType,
			despatchContact:dbType.contactType
		},
		deliveryCustomerParty:{
			party:dbType.partyType,
			deliveryContact:dbType.contactType
		},
		sellerSupplierParty:{
			party:dbType.partyType,
			despatchContact:dbType.contactType
		},
		buyerCustomerParty:{
			party:dbType.partyType,
			deliveryContact:dbType.contactType
		},
		shipment:dbType.shipmentType,
		lineCountNumeric:dbType.numberValueType,
		receiptLine:[dbType.receiptLineType],
		localDocumentId: {type: String, default: ''},
		receiptStatus: {type: String, default: 'Draft',enum:['Draft','Pending','Queued', 'Processing','SentToGib','Success','Error']},
		receiptErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
		receiptErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
		localStatus: {type: String, default: '',enum:['','transferring','pending','transferred','error']},
		localErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now}
	})



	schema.pre('save', (next)=>{
		if(this.receiptLine){
			this.lineCountNumeric.value=this.receiptLine.length
		}
		next()
	})

	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})

	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	schema.index({'ioType':1})
	schema.index({'ID.value':1,})
	schema.index({'issueDate.value':1})
	schema.index({'uuid.value':1})
	schema.index({'eIntegrator':1})
	schema.index({'profileId.value':1})
	schema.index({'receiptAdviceTypeCode.value':1})
	schema.index({'localDocumentId':1})
	schema.index({'receiptStatus':1})
	schema.index({'localStatus':1})
	schema.index({'createdDate':1})
	

	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }

	return model
}
