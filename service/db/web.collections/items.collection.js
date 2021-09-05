var itemsSchemas=require('./items.schemas.js')
var categoryConn={}

module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')

	let schema = mongoose.Schema(itemsSchemas())

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=conn.model(collectionName, schema)
	model.conn=conn
	model.removeOne=(member, filter,cb)=>{ sendToTrash(model,collectionName,member,filter,cb) }
	model.save=function(member,doc,cb){
		if(!doc._id){
			doc.memberId=member._id
			doc.createdDate=new Date()
		}
		doc.modifiedDate=new Date()
		let conn
		let connName=doc.category || '_rootConn'
		if(categoryConn[connName]==undefined){
			conn=this.conn.useDb(this.db.name)
			categoryConn[connName]=conn
		}else{
			conn=categoryConn[connName]
		}
		
		let model=conn.model(this.collection.collectionName, itemsSchemas(doc.category))

		newDoc=new model(doc)
		if(!epValidateSync(newDoc,(err)=>{
			freeModels(conn)
			cb(err)
		})){
			return
		}

		newDoc.save((err,newDoc2)=>{
			let obj={}
			if(!err){
				if(newDoc2)
					obj=newDoc2.toJSON()
			}
			freeModels(conn)
			if(!err){
				cb(null,obj)
			}else{
				cb(err)
			}
		})
	}

	return model
}




