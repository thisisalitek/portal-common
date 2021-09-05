module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations'], required: [true,'Istasyon gereklidir.']},
		machineGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machine_groups', mdl:dbModel['mrp_machine_groups'], required: [true,'Makine grubu gereklidir.']},
		name: {type: String, trim:true, required: true},
		description: {type: String, trim:true},
		minCapacity:{type: Number, default:0},
		maxCapacity:{type: Number, default:0},
		power:{type: Number, default:0},
		machineParameters:[{
			name:{type: String, trim:true, default:''},
			value:{type: String, trim:true, default:''}
		}],
		account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel['accounts'], default:null },
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
	return model
}
