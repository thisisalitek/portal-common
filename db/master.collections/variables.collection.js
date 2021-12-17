module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
    parameter: {type: String, trim:true, default:""},
    value: {type: Object}
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
