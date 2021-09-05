module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		memberId: {type: mongoose.Schema.Types.ObjectId, default:null, index:true},
		memberName:{type: String, trim:true, default:''},
		content:{type: String, trim:true, default:''},
		content_data:{},
		tags:[{type: String, trim:true, default:'', index:true}],
		taggedPeople:[{type: mongoose.Schema.Types.ObjectId, default:null, index:true}],
		likes:{ 
			count:{type: Number, default:0, index:true},
			list:[]
		},
		dislikes:{ 
			count:{type: Number, default:0, index:true},
			list:[]
		},
		comments:{ 
			count:{type: Number, default:0, index:true},
			list:[]
		},
		views:{ 
			count:{type: Number, default:0, index:true},
			list:[]
		},
		reports:{ 
			count:{type: Number, default:0, index:true},
			list:[]
		},
		startDate: { type: Date,default: Date.now, index:true },
		endDate:{ type: Date,default: Date.now, index:true },
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate: { type: Date,default: Date.now, index:true },
		deleted: {type: Boolean, default: false},
		deletedDate: { type: Date,default: Date.now, index:true }
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(model,collectionName,member,filter,cb) }
	
	return model
}

