module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		item: {type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], index:true},
		sourceRecipe: {type: mongoose.Schema.Types.ObjectId, ref: 'recipes', mdl:dbModel['recipes'], default:null, index:true},
		productionId:{type: String, trim:true, default: '', index:true},
		productionTypeCode: { type: String,default: '', trim:true, enum:['MUSTERI','DEPO'] , index:true},
		issueDate: { type: String,  required: [true,'İş Emri tarihi gereklidir'], index:true},
		issueTime: { type: String,default: '00:00:00.0000000+03:00', index:true},
		plannedPeriod: {
			startDate: { type: String, trim:true, default: '', index:true},
			startTime: { type: String, trim:true, default: '', index:true},
			endDate: { type: String, trim:true, default: '', index:true},
			endTime: { type: String, trim:true, default: '', index:true}
		},
		producedPeriod: {
			startDate: { type: String, trim:true, default: '', index:true},
			startTime: { type: String, trim:true, default: '', index:true},
			endDate: { type: String, trim:true, default: '', index:true},
			endTime: { type: String, trim:true, default: '', index:true}
		},
		plannedQuantity:{ type: Number, default: 0, index:true},
		producedQuantity:{ type: Number, default: 0, index:true},
		unitCode:{type: String, trim:true, default: '', index:true},
		orderLineReference:[{
			lineId:dbType.idType,
			item:dbType.itemType,
			orderedQuantity:dbType.quantityType,
			producedQuantity:dbType.quantityType,
			deliveredQuantity:dbType.quantityType,
			orderReference:{
				order:{type: mongoose.Schema.Types.ObjectId, ref: 'orders', mdl:dbModel['orders'], default:null},
				ID:dbType.idType,
				issueDate:dbType.valueType,
				orderTypeCode:dbType.valueType,
				salesOrderId:dbType.idType,
				buyerCustomerParty:{
					party:dbType.partyType,
					deliveryContact:dbType.contactType,
					accountingContact:dbType.contactType,
					buyerContact:dbType.contactType
				}
			}
		}],
		description:{ type: String, trim:true, default: '', index:true},
		process:[{
			sequence:{ type: Number, default: 0},
			station: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_stations', mdl:dbModel['mrp_stations']},
			step: {type: mongoose.Schema.Types.ObjectId, ref: 'mrp_process_steps', mdl:dbModel['mrp_process_steps']},
			machines: [ {
				machine:{type: mongoose.Schema.Types.ObjectId, ref: 'mrp_machines', mdl:dbModel['mrp_machines'], default:null},
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
			parameters:{type: String, trim:true, default: ''}
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
			param:{type: String, trim:true, default: ''},
			value:{type: String, trim:true, default: ''}
		}],
		totalWeight:{ type: Number, default: 0},
		finishNotes:{type: String, default: ''},
		packingOption:{
			palletType:{type: mongoose.Schema.Types.ObjectId, ref: 'pallet_types', mdl:dbModel['pallet_types'],default:null, index:true},
			packingType:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null, index:true},
			quantityInPacking:{ type: Number, default: 0},
			palletRowCount:{ type: Number, default: 0},
			packingCountInRow:{ type: Number, default: 0},
			unitCode:{type: String, trim:true, default: ''},
			packingType2:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null},
			packingType3:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null}
		},
		totalPallet:{ type: Number, default: 0, index:true},
		totalPacking:{ type: Number, default: 0, index:true},
		staffCount:{ type: Number, default: 0, index:true},
		status: {type: String, default: 'Draft',enum:['Draft', 'Approved', 'Declined', 'Processing', 'Cancelled','Completed','Error'], index:true},
		createdDate: { type: Date,default: Date.now, index:true},
		modifiedDate:{ type: Date,default: Date.now},
		cancelled: {type: Boolean, default: false, index:true}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
	model.relations={inventory_fiches:'productionOrderId'}
	return model
}
