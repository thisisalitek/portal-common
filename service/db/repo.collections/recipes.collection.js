module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], index:true},
		name:{type: String, default: '', index:true},
		description:{type: String, trim:true, default: '', index:true},
		revision:{ type: Number, default: 1, index:true},
		mrpVersion:{ type: Number, default: 1, index:true},
		process:[{
			sequence:{ type: Number, default: 0},
			station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations']},
			step: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_process_steps', mdl:dbModel['mrp_process_steps']},
			machines: [{
				machineGroup:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machine_groups', mdl:dbModel['mrp_machine_groups'], default:null},
				mold:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_molds', mdl:dbModel['mrp_molds'], default:null},
				cycle:dbType.measureType,
				cavity:{ type: Number, default: 0},
				quantityPerHour:{ type: Number, default: 0},
				parameters:{type:Object,default:null}
			}],
			input: [{
				item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
				quantity:{ type: Number, default: 0},
				unitCode:{type: String, trim:true, default: ''},
				percent:{ type: Number, default: 0}
			}],
			output: [{
				item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
				quantity:{ type: Number, default: 0},
				unitCode:{type: String, trim:true, default: ''},
				percent:{ type: Number, default: 0}
			}],
			parameters:{type: String, default: ''}
		}],
		materialSummary:[{
			item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
			quantity:{ type: Number, default: 0},
			unitCode:{type: String, trim:true, default: ''},
			percent:{ type: Number, default: 0}
		}],
		outputSummary:[{
			item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items']},
			quantity:{ type: Number, default: 0},
			unitCode:{type: String, trim:true, default: ''},
			percent:{ type: Number, default: 0}
		}],
		qualityControl:[{
			param:{type: String,trim:true, default: ''},
			value:{type: String,trim:true, default: ''}
		}],
		isDefault: {type: Boolean, default: false, index:true},
		totalQuantity:{ type: Number, default: 100, index:true},
		totalWeight:{ type: Number, default: 0, index:true},
		staffCount:{ type: Number, default: 0, index:true},
		createdDate: { type: Date,default: Date.now, index:true},
		modifiedDate:{ type: Date,default: Date.now},
		passive: {type: Boolean, default: false, index:true}
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
