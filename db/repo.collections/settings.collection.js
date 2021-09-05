module.exports=function(dbModel){
	let collectionName=path.basename(__filename,'.collection.js')
	let schema = mongoose.Schema({
		type:{type: String, default:'', enum:['global','user'],index:true},
		memberId: {type: mongoose.Schema.Types.ObjectId, default: null,index:true},
		module:{type: String, default:'',index:true},
		name:{type: String, default:'',index:true},
		createdDate: { type: Date,default: Date.now, index:true },
		modifiedDate:{ type: Date,default: Date.now, index:true },
		programButtons:[{
			program:{type: mongoose.Schema.Types.ObjectId, ref: 'programs', mdl:dbModel['programs']},
			text: {type: String, default: ''},
			icon: {type :String, default:''},		
			class: {type :String, default:''},
			passive:{ type: Boolean, default:false }
		}],
		print:{
			form:{type: mongoose.Schema.Types.ObjectId, ref: 'print_designs', mdl:dbModel['print_designs'], default: null},
			list:{type: mongoose.Schema.Types.ObjectId, ref: 'print_designs', mdl:dbModel['print_designs'], default: null}
		},
		autoSave:{ type: Boolean, default:false }
	})

	schema.pre('save', function(next) {
		this.name=`${this.type}_${this.module}`
		next()
	})
	schema.pre('remove', (next)=>next())
	schema.pre('remove', true, (next, done)=>next())
	schema.on('init', (model)=>{})
	schema.plugin(mongoosePaginate)
	schema.plugin(mongooseAggregatePaginate)
	
	let model=dbModel.conn.model(collectionName, schema)
	return model
}
