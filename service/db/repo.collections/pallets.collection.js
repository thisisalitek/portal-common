module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		palletType: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], required: [true,'Palet tipi gereklidir.'], index:true},
		name: {type: String, trim:true, required: [true,'isim gereklidir.'] , unique:true},
		location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null},
		pack:[{
			item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], default:null},
			lotNo: {type: String, trim:true, default:'' , index:true},
			serialNo: {type: String, trim:true, default:'' , index:true},
			quantity: {type: Number, default: 0, index:true},
			quantity2: {type: Number, default: 0, index:true},
			quantity3: {type: Number, default: 0, index:true},
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
	model.relations={actions:'inventory.palletId'}
	return model
}
