module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
    connectorId: {type: Number, default:0, unique : true},
    connectorPass: {type: String, required: true},
    uuid: {type: String, required: true,default:""},
    version: {type: String, default:""},
    ip: {type: String, required: true,default:""},
    platform: {type: String,default:""},
    architecture: {type: String,default:""},
    hostname: {type: String,default:""},
    release: {type: String,default:""},
    userInfo: {type: Object,default:null},
    cpus: {type: Object,default:null},
    freemem: {type: Number,default:0},
    totalmem: {type: Number,default:0},
    createdDate: { type: Date,default: Date.now},
    lastOnline:{ type: Date,default: Date.now},
    lastError: {type: String, default:""},
    passive: {type: Boolean, default: false}
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
