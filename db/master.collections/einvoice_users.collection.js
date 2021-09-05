module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		identifier: {type: String, trim:true, default:"" ,index:true},
    postboxAlias: {type: String, trim:true, default:"",index:true},
    senderboxAlias: {type: String, trim:true, default:"",index:true},
    title: {type: String, trim:true, default:"",index:true},
    type: {type: String, trim:true, default:""},
    systemCreateDate: { type: Date,default: Date.now},
    firstCreateDate: { type: Date,default: Date.now},
    enabled: {type: Boolean, default: false,index:true}
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
