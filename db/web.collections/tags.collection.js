module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		name:{type: String, trim:true, required:[true,'isim gereklidir'], unique:true},
		textTR:{type: String, trim:true, default:''},
		textEN:{type: String, trim:true, default:''},
		similar:[{type: mongoose.Schema.Types.ObjectId, index:true}],
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true }
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(model,collectionName,member,filter,cb) }
	
	return model
}


