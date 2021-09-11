module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		owner: {type: mongoose.Schema.Types.ObjectId, ref: 'portal_members', default: null, index:true},
    dbName: {type: String, required: true, index:true},
    userDb: {type: String, default: "", index:true},    //kullanici icin acilan mongodb ismi
    userDbHost: {type: String,  default: "mongodb://localhost:27017/", index:true},  //kullanicin veri tabaninin bulundugu mongo server address
    authorizedMembers:[{
        memberId:{type: mongoose.Schema.Types.ObjectId, ref: 'portal_members', default: null, index:true},
        canRead:{type: Boolean, default: true},
        canWrite:{type: Boolean, default: false},
        canDelete:{type: Boolean, default: false}
        }
    ],
    services:{
    	portal:{type: Boolean, default: false, index:true},
    	task:{type: Boolean, default: true, index:true},
    	posDevice:{type: Boolean, default: false, index:true},
    	eIntegration:{
    		eDespatch:{type: Boolean, default: false, index:true},
    		eInvoice:{type: Boolean, default: false, index:true},
    		eLedger:{type: Boolean, default: false, index:true}
    	},
    	wooIntegrations:{
    		n11:{type: Boolean, default: false, index:true},
    		gittigidiyor:{type: Boolean, default: false, index:true},
    		amazon:{type: Boolean, default: false, index:true},
    		amazontr:{type: Boolean, default: false, index:true},
    		hepsiburada:{type: Boolean, default: false, index:true}
    	},
    	localConnector:{type: Boolean, default: false, index:true}
    },
    createdDate: { type: Date,default: Date.now},
    modifiedDate:{ type: Date,default: Date.now},
    version:{type: String, default: "", index:true},
    deleted: {type: Boolean, default: false, index:true},
    passive: {type: Boolean, default: false, index:true}
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
