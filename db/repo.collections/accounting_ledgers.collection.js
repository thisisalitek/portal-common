module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		ledgerYear:{ type: Number,default: ()=>(new Date()).getFullYear() , index:true},
		ledgerPeriod:{ type: Number,default: ()=>(new Date()).getMonth()+1 , index:true},
		uuid: {type: String, default: ''},
		startJournalNumber:{ type: Number,default: 0 , index:true },
		endJournalNumber:{ type: Number,default: 0 , index:true },
		startJournalLineNumber:{ type: Number,default: 0 , index:true },
		endJournalLineNumber:{ type: Number,default: 0 , index:true },
		ledgerStatus: {type: String, default: 'Draft',enum_qwerty:['Deleted','Pending','Draft','Canceled','Queued', 'Processing','SentToGib','Approved','PartialApproved','Declined','WaitingForApprovement','Error']},
		ledgerErrors:[{	_date:{ type: Date,default: Date.now}, code:'',message:''}],
		localStatus: {type: String, default: '',enum:['','pending','transferring','transferred','error']},
		localErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true }
	})

	schema.pre('save', (next)=>{
		
	})
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
	model.relations={}
	return model
}

