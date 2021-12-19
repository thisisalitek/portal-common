module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		partyType:{ type: String, trim:true, default: '',enum:['Customer','Vendor','Both','Agency'],index:true},
		mainParty: {type: mongoose.Schema.Types.ObjectId, 
			validate: {
				validator: function(v) {
					if((this.partyType=='Ageny') && ( (v || '') == '')){
						return false
					}else{
						return true
					}
				},
				message: 'Acente eklerken, ana firma secmelisiniz'
			},
			default:null
		},
		account: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts', mdl:dbModel['accounts'],default:null},
		websiteURI:dbType.valueType,
		partyIdentification:[dbType.partyIdentificationType],
		partyName:{
			name:{value:{ type: String, trim:true, required:[true,'Isim gereklidir'], default: ''}}
		},
		postalAddress:dbType.addressIndexedType,
		partyTaxScheme:{
			taxScheme:{
				name:dbType.valueType,
				taxTypeCode:dbType.valueType
			}
		},
		contact:dbType.contactType,
		person:dbType.personType,
		tags:{ type: String, trim:true, default: '',index:true},
		passive:{type:Boolean , default:false},
		createdDate: { type: Date,default: Date.now},
		modifiedDate:{ type: Date,default: Date.now}
	})

	schema.pre('save', (next)=>next())
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)

	schema.index({
		"partyName.name.value":1,
		"partyType":1,
		"passive":1,
		"postalAddress.province.value":1,
		"postalAddress.cityName.value":1,
		"person.firstName.value":1,
		"person.middleName.value":1,
		"person.familyName.value":1,
		"createdDate":1,
		"tags":1
	})

	let model=dbModel.conn.model(collectionName, schema)
	model.removeOne=(member, filter,cb)=>{ sendToTrash(dbModel,collectionName,member,filter,cb) }
	
	return model
}
