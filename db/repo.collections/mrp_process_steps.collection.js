module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		name: {type: String, trim:true, required: [true,'isim gereklidir'], unique:true},
		useMaterialInput: {type: Boolean, default: false},
		useMaterialOutput: {type: Boolean, default: false},
		useMachine: {type: Boolean, default: false},
		useMold: {type: Boolean, default: false},
		useParameters: {type: Boolean, default: false},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now},
		passive: {type: Boolean, default: false}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	let model=dbModel.conn.model(collectionName, schema)
	
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
	model.relations={qwerty:'qwerty'}
	return model
}
