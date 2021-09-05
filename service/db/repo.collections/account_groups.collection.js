module.exports=function(dbModel){
	let collectionName='account_groups'
	let schema = mongoose.Schema({
		name:{type: String, trim:true, required:[true,'isim gereklidir'], unique:true},
		account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		salesAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		returnAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		exportSalesAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		salesDiscountAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		buyingDiscountAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		costOfGoodsSoldAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel.accounts, default:null },
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true }
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
	model.relations={items:'accountGroup'}
	return model
}

