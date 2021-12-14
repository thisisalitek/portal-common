module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({

		module: {type :String, trim:true, required: true, index:true},        
		func: {type :String, trim:true, required: true, index:true},        
		name: {type :String, trim:true, default:'', index:true},
		design: {type :String, default:''},
		createdDate: { type: Date,default: Date.now, index:true},
		modifiedDate:{ type: Date,default: Date.now},
		isDefault: {type: Boolean, default: true, index:true},
		passive: {type: Boolean, default: false, index:true}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	
	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }

	return model
}
