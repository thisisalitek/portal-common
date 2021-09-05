module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		name: {type: String, trim:true, required: [true,'isim/kod gereklidir.'] , unique:true},
		description: {type: String, trim:true, default:''},
		width: {type: Number, default: 0, index:true},
		length: {type: Number, default: 0, index:true},
		height: {type: Number, default: 0, index:true},
		weight:{type: Number, default: 0, index:true},
		maxWeight:{type: Number, default: 0, index:true},
		content:[{
			sequence:{type: Number, default: 0},
			item: {type: mongoose.Schema.Types.ObjectId},
			quantity: {type: Number, default: 0, index:true},
			unitCode:{type: String, trim:true, default: '', index:true},
			color:{type: mongoose.Schema.Types.ObjectId, default:null, index:true},
			pattern:{type: mongoose.Schema.Types.ObjectId, default:null, index:true},
			size:{type: mongoose.Schema.Types.ObjectId, default:null, index:true}
		}],
		createdDate: { type: Date,default: Date.now, index:true},
		modifiedDate:{ type: Date,default: Date.now},
		passive: {type: Boolean, default: false, index:true}
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
