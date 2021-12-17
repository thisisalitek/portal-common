const vehicleSchemaObj={
	horsePower:{type: Number, required:[true,'Motor gücü gereklidir'], index:true},
	brand:{type: String, trim:true, required:[true,'Marka gereklidir'], enum:Object.keys(staticValues.carBrandList), index:true},
	modelYear:{type: Number, required:[true,'Model gereklidir'], index:true},
	engineCapacity:{type: Number, required:[true,'Moto kapasitesi gereklidir'], index:true},
	airConditioner: {type: Boolean, default: false, index:true}
}

const defaultSchema={
	memberId: {type: mongoose.Schema.Types.ObjectId, default:null, index:true},
	category:{type: String, trim:true, required:[true,'Kategori gereklidir'], index:true},
	title:{type: String, trim:true, required:[true,'Başlık gereklidir'], index:true},
	description:{type: String, trim:true, default:'', index:true},
	tags:{type: String, trim:true, default:'', index:true},
	image:{type: mongoose.Schema.Types.ObjectId, default: null, ref:'images', index:true},
	images:[{type: mongoose.Schema.Types.ObjectId, default: null,ref:'images'}],
	// params:{type: Object, default:{}, index:true},
	likes:[],
	likes_count:{type: Number, default:0, index:true},
	dislikes:[],
	dislikes_count:{type: Number, default:0, index:true},
	followers:[],
	followers_count:{type: Number, default:0, index:true},
	comments:[],
	comments_count:{type: Number, default:0, index:true},
	createdDate: { type: Date,default: Date.now, index:true },
	modifiedDate:{ type: Date,default: Date.now, index:true },
	approvedBy: {type: String, default: '', index:true},
	approvedById: {type: mongoose.Schema.Types.ObjectId, default: null, index:true},
	status: {type: String, default: 'Draft',enum:['Draft','Canceled','Approved','Declined','WaitingForApprovement','Error'],index:true},
	itemErrors:[{_date:{ type: Date,default: Date.now}, code:'',message:''}],
	passive: {type: Boolean, default: false, index:true}
}

module.exports=function(category){

	let schemaObj=Object.assign({},defaultSchema)
	category=category || ''

	if(category.split('.')[0]=='vehicle'){
		schemaObj.params=Object.assign({},vehicleSchemaObj)
	}
	return schemaObj
}



