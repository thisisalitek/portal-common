module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		uploadById: {type: mongoose.Schema.Types.ObjectId, default:null, index:true},
    caption: {type :String,  trim:true, default:'', index:true},
    tags: {type :String,  trim:true, default:'', index:true},
    fileName: {type :String,  trim:true, default:'', index:true},
    width:{type:Number,default:0, index:true},
    height:{type:Number,default:0, index:true},
    rotate:{type:Number,default:0},
    zoom:{type:Number,default:0},
    marginTop:{type:Number,default:0},
    marginLeft:{type:Number,default:0},
		data: {type :String, default:''},
		small: {type :String, default:''},
		medium: {type :String, default:''},
		large: {type :String, default:''},
    adult: {type:Boolean, default: false, index:true},
    blur: {type:Boolean, default: false, index:true},
    approved: {type:Boolean, default: true, index:true},
		approvedBy: {type: String, default: '', index:true},
		approvedById: {type: mongoose.Schema.Types.ObjectId, default: null, index:true},
    createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true },
		passive: {type:Boolean, default: false, index:true}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	
	let model=conn.model(collectionName, schema)

	model.removeOne=(member, filter,cb)=>{ sendToTrash(conn,collectionName,member,filter,cb) }
	return model
}
