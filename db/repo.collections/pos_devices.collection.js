module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], required: [true,'Lokasyon gereklidir.'] , index:true},
		service: {type: mongoose.Schema.Types.ObjectId, ref: 'pos_device_services', mdl:dbModel['pos_device_services'], required: [true,'Yazarkasa servisi gereklidir.'], index:true},
		deviceSerialNo: {type: String, required: [true,'Cihaz seri numarasi gereklidir.'], index:true},
		deviceModel: {type: String, default: '', index:true},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now},
		passive: {type: Boolean, default: false, index:true},
		lastError:{_date:{ type: Date,default: Date.now}, code:'',message:''}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	
	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }

	model.relations={pos_device_zreports:'posDevice'}

	return model
}
