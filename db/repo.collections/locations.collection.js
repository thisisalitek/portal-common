module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
  let schema = mongoose.Schema({
      name: {type: String, trim:true, required:  [true,'isim gereklidir.']  , index:true},
      type: {type: String, required:  [true,'tur gereklidir.'] , default:'', 
      enum:['warehouse','shop','manufacture','return','mobile','other'], index:true}, 
      createdDate: { type: Date,default: Date.now, index:true},
      modifiedDate:{ type: Date,default: Date.now},
      subLocations:[
      	{
      		name: {type: String, required:  [true,'isim gereklidir.']},
      		passive: {type: Boolean, default: false}
      	}
      ],
      passive: {type: Boolean, default: false, index:true}
  })

  schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
  model.relations={pos_devices:'location',machines:'location'}
  
  return model
}
