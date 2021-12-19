module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		username: {type:String, required: true,index:true},
		role: {type :String, default: 'user'},
		name:{type :String, trim:true, default: ''},
		lastName:{type :String, trim:true, default: ''},
		gender: {type :String, default: '',enum:['','male','female','other']},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now},
		modules:{},
		passive: {type: Boolean, default: false,index:true}
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


