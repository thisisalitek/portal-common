module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		itemType: {type: String, trim:true, index:true, required: [true,'itemType gereklidir'], default: 'item', enum:['item','raw-material','helper-material','product','semi-product','sales-service','purchasing-service','asset','expense']},
		name:{ value:{type: String, trim:true,default:'', unique:true}},
		description:{ value:{type: String, trim:true,default:'', index:true}},
		additionalItemIdentification:[{ID:dbType.idType}],
		brandName:{ value:{type: String, trim:true,default:'', index:true}},
		buyersItemIdentification:{ID:dbType.idType},
		commodityClassification:[
		{
			itemClassificationCode:dbType.codeType
		}
		],
		keyword:{ value:{type: String, trim:true,default:'', index:true}},
		manufacturersItemIdentification:{ID:dbType.idType},
		modelName:{ value:{type: String, trim:true,default:'', index:true}},
		sellersItemIdentification:{ID:dbType.idType},
		originCountry:dbType.countryType,
		itemInstance:[dbType.itemInstanceType],
		taxTotal:[dbType.taxTotalType],
		withholdingTaxTotal:[dbType.taxTotalType],
		accountGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'account_groups', mdl:dbModel['account_groups'], default:null},
		similar:[{type: mongoose.Schema.Types.ObjectId}],
		unitPacks:[{
			unitCode:{type: String, trim:true, default: ''},
			netWeight:dbType.quantityType,
			dimension:{ width:dbType.measureType, height:dbType.measureType,length:dbType.measureType},
			barcode:{type: String, trim:true, default: ''}
		}],
		vendors:[{
			sequenceNumeric:dbType.numberValueType,
			vendor:{type: mongoose.Schema.Types.ObjectId, ref: 'parties', mdl:dbModel['parties']},
			supplyDuration:dbType.numberValueType
		}],
		tracking:{
			lotNo:{type: Boolean, default: false},
			serialNo:{type: Boolean, default: false},
			color:{type: Boolean, default: false},
			pattern:{type: Boolean, default: false},
			size:{type: Boolean, default: false}
		},
		unitCode:{type: String, trim:true, default: 'NIU'},
		unitCode2:{type: String, trim:true, default: ''},
		unitCode3:{type: String, trim:true, default: ''},
		supplyDuration:dbType.numberValueType,
		tags:{type: String, trim:true, default: ''},
		images:[{type: mongoose.Schema.Types.ObjectId, ref: 'files', mdl:dbModel['files']}],
		files:[{type: mongoose.Schema.Types.ObjectId, ref: 'files', mdl:dbModel['files']}],
		exceptInventory: {type: Boolean, default: false},
		exceptRecipeCalculation: {type: Boolean, default: false},
		recipe: {type: mongoose.Schema.Types.ObjectId, default:null},
		packingOptions:[{
			palletType:{type: mongoose.Schema.Types.ObjectId, ref: 'pallet_types', mdl:dbModel['pallet_types'],default:null},
			packingType:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null},
			quantityInPacking:{ type: Number, default: 0},
			palletRowCount:{ type: Number, default: 0},
			packingCountInRow:{ type: Number, default: 0},
			unitCode:{type: String, trim:true, default: ''},
			packingType2:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null},
			packingType3:{type: mongoose.Schema.Types.ObjectId, ref: 'packing_types', mdl:dbModel['packing_types'],default:null}
		}],
		localDocumentId: {type: String, default: ''},
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

	return model
}
