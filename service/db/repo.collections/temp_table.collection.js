module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		docType: {type: String, default: '',required:true,index:true},
		docId: {type: String, default: '',index:true},
		docId2: {type: String, default: '',index:true},
		document: {type: Object, default: null},
		status: {type: String, default: '',index:true},
		orderBy: {type: Object, default: null,index:true},
		createdDate: { type: Date,default: Date.now,index:true},
		modifiedDate:{ type: Date,default: Date.now,index:true},
		error:{code:'',message:''}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }

	return model
}