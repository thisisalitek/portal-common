global.dbType=require('./db-types')

global.mongoose = require('mongoose')
global.mongoosePaginate = require('mongoose-paginate-v2')
global.mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
mongoosePaginate.paginate.options = { 
	lean:  true,
	limit: 10
}
global.ObjectId = mongoose.Types.ObjectId

// mongoose.set('useCreateIndex', true)
// mongoose.set('useFindAndModify', false)


global.sendToTrash=(dbModel,collectionName,member,filter,cb)=>{

	conn=dbModel.conn
	let recycle=dbModel['recycle']
	
	conn.model(collectionName).findOne(filter,(err,doc)=>{
		if(!err){
			function silelim(cb1){
				conn.model('recycle').insertMany([{collectionName:collectionName,documentId:doc._id,document:doc,deletedBy:member.username,deletedById:member._id}],(err)=>{
					if(!err){
						conn.model(collectionName).deleteOne(filter,(err,doc)=>{
							cb1(err,doc)
						})
					}else{
						cb1(err)
					}
				})
			}

			if(conn.model(collectionName).relations){
				var keys=Object.keys(conn.model(collectionName).relations)
				var index=0

				function kontrolEt(cb2){
					if(index>=keys.length){
						cb2(null)
					}else{
						var relationFilter={}
						var k=keys[index]

						relationFilter[conn.model(collectionName).relations[k]]=doc._id
						conn.model(k).countDocuments(relationFilter,(err,c)=>{
							if(!err){
								if(c>0){
									cb2({name:'RELATION_ERROR',message:"Bu kayit '" + k + "' tablosuna baglidir. Silemezsiniz!"})

								}else{
									index++
									setTimeout(kontrolEt,0,cb2)
								}
							}else{
								cb2(err)
							}
						})
					}
				}

				kontrolEt((err)=>{
					if(!err){
						silelim(cb)
					}else{

						cb(err)
					}
				})
			}else{
				silelim(cb)
			}

		}else{
			cb(err)
		}
	})
}


global.dberr=(err,cb)=>{
	if(!err){
		return true
	}else{
		if(!cb){
			throw err
			return false
		}else{
			cb(err)
			return false
		}
	}
}

global.dbnull=(doc,cb,msg='Kayıt bulunamadı')=>{
	if(doc!=null){
		return true
	}else{
		var err={code:'RECORD_NOT_FOUND',message:msg}
		if(!cb){
			throw err
			return false
		}else{
			cb(err)
			return false
		}
	}
}

mongoose.set('debug', false)

process.on('SIGINT', function() {  
	mongoose.connection.close(function () { 
		eventLog('Mongoose default connection disconnected through app termination') 
		process.exit(0) 
	}) 
}) 

global.epValidateSync=(doc,cb)=>{
	var err = doc.validateSync()
	if(err){
		var keys=Object.keys(err.errors)
		var returnError={code:'HATALI_VERI',message:''}
		keys.forEach((e,index)=>{
			returnError.message +=`#${(index+1).toString()} : ${err.errors[e].message}`
			if(index<keys.length-1)
				returnError.message +='  |  '
		})

		if(cb){
			cb(returnError)
			return false
		}
		else{
			throw returnError
		}
	}else{
		return true
	}
}

global.db={
	dbName:'@MasterDb',
	get nameLog(){
		return dbNameLog(this.dbName) 
	}
}
global.dbWeb={
	dbName:'@dbWeb',
	get nameLog(){
		return dbNameLog(this.dbName)
	}
}

global.workerDb={
	dbName:'@workerDb',
	get nameLog(){
		return dbNameLog(this.dbName)
	}
}

module.exports=(cb)=>{

	baglan('master.collections',config.mongodb.master,db,(err)=>{
		if(!err){
			initRepoDb()
			baglan('web.collections',config.mongodb.web,dbWeb,(err)=>{
				if(!err){
					baglan('worker.collections',config.mongodb.worker,workerDb,(err)=>{
						cb(err)
					})
				}else{
					cb(err)
				}
			})
			
			
		}else{
			cb(err)
		}
	})
}

function baglan(collectionFolder, mongoAddress, dbObj, cb){
	if(collectionFolder && mongoAddress && !dbObj.conn){
		moduleLoader(path.join(__dirname, collectionFolder),'.collection.js',``,(err,holder)=>{
			if(!err){
				dbObj.conn = mongoose.createConnection(mongoAddress,{ useNewUrlParser: true ,useUnifiedTopology:true, autoIndex: true  })
				dbObj.conn.on('connected', ()=>{
					Object.keys(holder).forEach((key)=>{
						dbObj[key]=holder[key](dbObj.conn)
					})
					if(dbObj.conn.active!=undefined){
						eventLog(`${dbObj.nameLog} ${'re-connected'.green}`)
					}else{
						eventLog(`${dbObj.nameLog} ${'connected'.brightGreen}`)
					}
					dbObj.conn.active=true
					if(cb)
						cb(null,dbObj)
				})

				dbObj.conn.on('error', (err)=>{
					dbObj.conn.active=false
					errorLog(`${dbObj.nameLog} Error:\r\n`,err)
					if(cb)
						cb(err)
				}) 

				dbObj.conn.on('disconnected', ()=>{
					dbObj.conn.active=false
					eventLog(`${dbObj.nameLog} ${'disconnected'.cyan}`)
					
				})
			}else{
				if(cb)
					cb(err)
			}
		})
	}else{
		if(cb)
			cb(null,dbObj)
	}
}


global.repoHolder={}

var serverConn1,serverConn2,serverConn3

function initRepoDb(){
	moduleLoader(path.join(__dirname, 'repo.collections'),'.collection.js',``,(err,holder)=>{
		repoHolder=holder

		if(!err){
			if(config.mongodb.server1){
				serverConn1 = mongoose.createConnection(config.mongodb.server1,{ useNewUrlParser: true ,useUnifiedTopology:true, autoIndex: true  })
				serverConn1.on('connected', ()=>{
					eventLog(`${config.mongodb.server1.brightBlue} ${'connected'.brightGreen}`)
				})

				serverConn1.on('error', (err)=>errorLog(`${config.mongodb.server1.brightBlue} Error:`,err)) 
				serverConn1.on('disconnected', ()=>eventLog(`${config.mongodb.server1.brightBlue} disconnected`))
			}
			if(config.mongodb.server2){
				serverConn2 = mongoose.createConnection(config.mongodb.server2,{ useNewUrlParser: true ,useUnifiedTopology:true, autoIndex: true  })
				serverConn2.on('connected', ()=>{
					eventLog(`${config.mongodb.server2.brightBlue} ${'connected'.brightGreen}`)
				})

				serverConn2.on('error', (err)=>errorLog(`${config.mongodb.server2.brightBlue} Error:`,err)) 
				serverConn2.on('disconnected', ()=>eventLog(`${config.mongodb.server2.brightBlue} disconnected`))
			}
			
		}else{
			errorLog('refreshRepoDb:',err)
		}
	})
}

global.repoDbModel=function(_id,cb){
	db.dbdefines.findOne({_id:_id,deleted:false,passive:false},(err,doc)=>{
		if(dberr(err,cb)){
			if(dbnull(doc,cb)){
				var dbModel={	get nameLog(){return dbNameLog(doc.dbName)} }
				dbModel._id=doc._id
				dbModel.dbName=doc.dbName
				dbModel.enabledServices=doc.services
				dbModel.authorizedMembers=doc.authorizedMembers
				switch(doc.userDbHost){
					case config.mongodb.server1:
					dbModel.conn=serverConn1.useDb(doc.userDb)
					break
					case config.mongodb.server2:
					dbModel.conn=serverConn2.useDb(doc.userDb)
					break
					case config.mongodb.server3:
					dbModel.conn=serverConn3.useDb(doc.userDb)
					break
				}
				
				dbModel.free=function(){
					Object.keys(dbModel.conn.models).forEach((key)=>{
						delete dbModel.conn.models[key]
						delete dbModel.conn.collections[key]
						delete dbModel.conn.base.modelSchemas[key]
					})
				}

				Object.keys(repoHolder).forEach((key)=>{
					Object.defineProperty(dbModel,key,{
						get:function(){
							if(dbModel.conn.models[key]){
								return dbModel.conn.models[key]
							}else{
								return repoHolder[key](dbModel)
							}
						}
					})
				})


				cb(null,dbModel)
			}
		}
	})
}


function moduleLoader(folder,suffix,expression,cb){
	try{
		var moduleHolder={}
		var files=fs.readdirSync(folder)
		files.forEach((e)=>{
			let f = path.join(folder, e)
			if(!fs.statSync(f).isDirectory()){
				var fileName = path.basename(f)
				var apiName = fileName.substr(0, fileName.length - suffix.length)
				if (apiName != '' && (apiName + suffix) == fileName) {
					moduleHolder[apiName] = require(f)
				}
			}
		})
		cb(null,moduleHolder)
	}catch(e){
		errorLog(`moduleLoader Error:\r\n\tfolder:${folder}\r\n\tsuffix:${suffix}\r\n\texpression:${expression}`,e)
		cb(e)
	}
}


function dbNameLog(s){
	return s.padding(20).brightBlue
}


var calisanServiceDatabaseler={}
global.runServiceOnAllUserDb=(options)=>{
	try{
		options.repeatInterval=options.repeatInterval || 60000

		var serviceName=options.name || app.get('name')
		var filter ={deleted:false,passive:false}
		filter=Object.assign({},filter,(options.filter || {}))

		if(!calisanServiceDatabaseler[serviceName]){
			calisanServiceDatabaseler[serviceName]={}
		}
		// eventLog(`${serviceName.yellow} filter:`,filter)
		function calistir(){
			db.dbdefines.find(filter).select('_id').exec((err,docs)=>{
				if(!err){
					eventLog(`${serviceName.yellow} ${docs.length.toString().brightBlue} adet veri ambari uzerinde calisiyor`)
					docs.forEach((doc)=>{
						if(!calisanServiceDatabaseler[serviceName][doc._id]){
							calisanServiceDatabaseler[serviceName][doc._id]={	working:true}
							repoDbModel(doc._id,(err,dbModel)=>{
								if(!err){
									dbModel.t=(new Date()).getTime()
									options.serviceFunc(dbModel,(err)=>{
										var fark=(((new Date()).getTime())-dbModel.t)/1000
										if(!err){
											eventLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} finished in ${fark.toString().yellow} sn`)
										}else{
											errorLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} ${fark.toString().yellow} sn Error:`,err)
										}
										dbModel.free()
										delete dbModel
										delete calisanServiceDatabaseler[serviceName][doc._id]
									})
								}else{
									errorLog(`${serviceName.yellow} error:`,err)
									delete calisanServiceDatabaseler[serviceName][doc._id]
								}
							})
						}
					})

					setTimeout(calistir,options.repeatInterval)
				}else{
					errorLog(`${serviceName.yellow} error:`,err)
					setTimeout(calistir,options.repeatInterval)
				}
			})
		}

		setTimeout(calistir,options.repeatInterval)
	}catch(tryErr){
		errorLog(`try catch error:`,tryErr)
		setTimeout(()=>{ runServiceOnAllUserDb(options) },options.repeatInterval)
	}
}


global.dbStats=function(doc,cb){
	var conn
	switch(doc.userDbHost){
		case config.mongodb.server1:
		conn=serverConn1.useDb(doc.userDb)
		break
		case config.mongodb.server2:
		conn=serverConn2.useDb(doc.userDb)
		break
		case config.mongodb.server3:
		conn=serverConn3.useDb(doc.userDb)
		break
	}
	conn.db.stats((err,statsObj)=>{
		if(!err){
			cb(null,statsObj)
		}else{
			cb(err)
		}
	})
}

global.freeModels=function(conn){
	Object.keys(conn.models).forEach((key)=>{
		delete conn.models[key]
		delete conn.collections[key]
		delete conn.base.modelSchemas[key]
	})
}