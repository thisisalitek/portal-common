var addressType=Object.freeze({
	room:dbType.valueIndexedType,
	streetName:dbType.valueIndexedType,
	blockName:dbType.valueIndexedType,
	buildingName:dbType.valueIndexedType,
	buildingNumber:dbType.valueIndexedType,
	citySubdivisionName:dbType.valueIndexedType,
	cityName:dbType.valueIndexedType,
	postalZone:dbType.valueIndexedType,
	postbox:dbType.valueIndexedType,
	region:dbType.valueIndexedType,
	district:dbType.valueIndexedType,
	country:{
		identificationCode:dbType.valueIndexedType,
		name:dbType.valueIndexedType
	}
})

module.exports=function(conn){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		username: {type:String, required: true,index:true},
		role: {type :String, default: "user"},
		name:{type :String, trim:true, default: ""},
		lastName:{type :String, trim:true, default: ""},
		gender: {type :String, default: ""},
		isMobile: {type :Boolean, default: true},
		email: {type :String, default: "",index:true},
		country: {type :String, default: "",index:true},
		favorites: [],
		point : {type :Number, default: 100},
		latitude: {type :Number, default: 0},
		longitude:{type :Number, default: 0},
		address:addressType,
		addressList:[{
			name: {type :String, default: "addresim"},
			address:addressType
		}],
		mainPicture: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
		taxboardPicture: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
		idCardPicture1: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
		idCardPicture2: {type: mongoose.Schema.Types.ObjectId, ref:'images' , default:null},
		images:[{type: mongoose.Schema.Types.ObjectId, default: null,ref:'images'}],
		showName :  {type :Boolean, default: true},
		showPicture :  {type :Boolean, default: true},
		profileEnabled :  {type :Boolean, default: true},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now},
		modules:{},
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


