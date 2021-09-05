module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		type: {type: String, trim:true, required: [true,'Servis turu gereklidir'], default: 'ingenico', enum:['ingenico','beko','hugin','profilo','verifone','olivetti','veradelta']},
		name: {type: String,  trim:true, required: [true,'Servis adi gereklidir']},
		url: {type: String, trim:true, default: ''},
		username: {type: String, trim:true, default: ''},
		password: {type: String, default: ''},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now},
		passive: {type: Boolean, default: false}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
	model.relations={pos_devices:'service'}

	return model
}
