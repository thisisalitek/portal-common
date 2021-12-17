module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		docTypeCode:{ type: String,default: '', trim:true, enum:['TRANSFER','GIRIS','CIKIS','SAYIMFAZLASI','SAYIMEKSIGI','SARF','URETIMECIKIS','URETIMDENGIRIS','SAYIM']},
		docId:{type: String, trim:true, default: '', unique:true},
		issueDate: { type: String, trim:true, required: [true,'Tarih gereklidir']},
		issueTime: { type: String, trim:true, default: '00:00:00.0000000+03:00'},
		productionOrderId: {type: mongoose.Schema.Types.ObjectId, ref: 'production_orders', mdl:dbModel['production_orders'], default:null},
		location: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null},
		location2: {type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null},
		description:{type: String, trim:true, default: ''},
		docLine:[{
			sequence:{ type: Number, default: 0},
			item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], default:null, index:true},
			quantity: {type: Number, default: 0, index:true},
			quantity2: {type: Number, default: 0, index:true},
			quantity3: {type: Number, default: 0, index:true},
			unitCode:{type: String, trim:true, default: '', index:true},
			pallet:{type: mongoose.Schema.Types.ObjectId, ref: 'pallets', mdl:dbModel['pallets'], default:null, index:true},
			lotNo:{type: String, trim:true, default: '', index:true},
			serialNo:{type: String, trim:true, default: '', index:true},
			color:{type: mongoose.Schema.Types.ObjectId, default:null, index:true},
			pattern:{type: mongoose.Schema.Types.ObjectId, default:null, index:true},
			size:{type: mongoose.Schema.Types.ObjectId, default:null, index:true}
		}],
		createdDate: { type: Date,default: Date.now, index:true},
		modifiedDate:{ type: Date,default: Date.now, index:true}
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
