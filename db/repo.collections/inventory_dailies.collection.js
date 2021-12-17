module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		item:{type: mongoose.Schema.Types.ObjectId, ref: 'items', mdl:dbModel['items'], default:null, index:true},
		issueDate:{type: String, trim:true, default: ''},
		quantity: {type: Number, default: 0, index:true},
		quantity2: {type: Number, default: 0, index:true},
		quantity3: {type: Number, default: 0, index:true},
		unitCode:{type: String, trim:true, default: '', index:true},
		locations:[{
			locationId:{type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null, index:true},
			quantity: {type: Number, default: 0, index:true},
			quantity2: {type: Number, default: 0, index:true},
			quantity3: {type: Number, default: 0, index:true},
			unitCode:{type: String, trim:true, default: ''},
			subLocations:[{
				subLocationId:{type: mongoose.Schema.Types.ObjectId, ref: 'locations', mdl:dbModel['locations'], default:null, index:true},
				quantity: {type: Number, default: 0, index:true},
				quantity2: {type: Number, default: 0, index:true},
				quantity3: {type: Number, default: 0, index:true},
				unitCode:{type: String, trim:true, default: ''}
			}]
		}],
		lastModified:{ type: Date, default: Date.now}
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
