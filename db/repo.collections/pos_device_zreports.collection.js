module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		posDevice: {type: mongoose.Schema.Types.ObjectId, ref: 'pos_devices', mdl:dbModel['pos_devices'], required: true,index:true},
		zNo: { type: Number,default: 0,index:true},
		zDate: { type: Date,default: null,index:true},
		zTotal: { type: Number,default: 0},
		data: {type: Object, default: null},
		status: {type: String, default: '',enum:['','transferring','pending','transferred','error'],index:true},
		error:{_date:{ type: Date,default: Date.now}, code:'',message:''},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now}
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
