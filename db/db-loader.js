'use strict'

global.dbType = require('./db-types')

global.mongoose = require('mongoose')
global.mongoosePaginate = require('mongoose-paginate-v2')
global.mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
mongoosePaginate.paginate.options = {
	lean: true,
	limit: 10
}
global.ObjectId = mongoose.Types.ObjectId

// mongoose.set('useCreateIndex', true)
// mongoose.set('useFindAndModify', false)


global.sendToTrash = (dbModel, collectionName, member, filter, cb) => {

	conn = dbModel.conn
	let recycle = dbModel['recycle']

	conn.model(collectionName).findOne(filter, (err, doc) => {
		if(!err) {
			function silelim(cb1) {
				conn.model('recycle').insertMany([{ collectionName: collectionName, documentId: doc._id, document: doc, deletedBy: member.username, deletedById: member._id }], (err) => {
					if(!err) {
						conn.model(collectionName).deleteOne(filter, (err, doc) => {
							cb1(err, doc)
						})
					} else {
						cb1(err)
					}
				})
			}

			if(conn.model(collectionName).relations) {
				let relations = conn.model(collectionName).relations
				let keys = Object.keys(relations)
				let index = 0
				let errorList=[]
				function kontrolEt(cb2) {
					if(index >= keys.length) {
						cb2(null)
					} else {
						repoDbModel(dbModel._id, (err, mdl) => {
							if(!err) {
								let k = keys[index]
								let relationFilter
								let errMessage = `Bu kayit <b>${k}</b> tablosuna baglidir.`
								if(Array.isArray(relations[k])) {
									if(relations[k].length > 0)
										if(typeof relations[k][0] == 'string') {
											relationFilter = {}
											relationFilter[relations[k][0]] = doc._id
											if(relations[k].length > 1)
												if(typeof relations[k][1] == 'string') errMessage = relations[k][1]
										}
								} else if(typeof relations[k] == 'object') {
									if(relations[k].field){
										relationFilter = {}
										relationFilter[relations[k].field] = doc._id
										if(relations[k].filter)	Object.assign(relationFilter,relations[k].filter)
										if(relations[k].message) errMessage=relations[k].message
									}
								}

								if(!relationFilter) {
									relationFilter = {}
									relationFilter[relations[k]] = doc._id
								}

								mdl[k].countDocuments(relationFilter, (err, c) => {
									if(!err) {
										if(c > 0) errorList.push(`${errMessage} ${c} Kayıt`)
										index++
										setTimeout(kontrolEt, 0, cb2)
									} else {
										cb2(err)
									}
								})
							} else {
								cb2(err)
							}
						})
					}
				}

				kontrolEt((err) => {
					if(!err && errorList.length==0) {
						silelim(cb)
					} else {
						errorList.unshift('<b>Bağlı kayıt(lar) var. Silemezsiniz!</b>')
						if(err) errorList.push(err.message)
						cb({name:'RELATION_ERROR',message:errorList.join('\n')})
					}
				})
			} else {
				silelim(cb)
			}

		} else {
			cb(err)
		}
	})
}


global.dberr = (err, cb) => {
	if(!err) {
		return true
	} else {
		if(!cb) {
			throw err
			return false
		} else {
			cb(err)
			return false
		}
	}
}

global.dbnull = (doc, cb, msg = 'Kayıt bulunamadı') => {
	if(doc != null) {
		return true
	} else {
		let err = { code: 'RECORD_NOT_FOUND', message: msg }
		if(!cb) {
			throw err
			return false
		} else {
			cb(err)
			return false
		}
	}
}

global.epValidateSync = (doc, cb) => {
	let err = doc.validateSync()
	if(err) {
		let keys = Object.keys(err.errors)
		let returnError = { code: 'HATALI_VERI', message: '' }
		keys.forEach((e, index) => {
			returnError.message += `#${(index+1).toString()} : ${err.errors[e].message}`
			if(index < keys.length - 1)
				returnError.message += '  |  '
		})

		if(cb) {
			cb(returnError)
			return false
		} else {
			throw returnError
		}
	} else {
		return true
	}
}

mongoose.set('debug', false)

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		eventLog('Mongoose default connection disconnected through app termination')
		process.exit(0)
	})
})

global.db = {
	dbName: '@MasterDb',
	get nameLog() {
		return dbNameLog(this.dbName)
	}
}
global.dbWeb = {
	dbName: '@dbWeb',
	get nameLog() {
		return dbNameLog(this.dbName)
	}
}

global.workerDb = {
	dbName: '@workerDb',
	get nameLog() {
		return dbNameLog(this.dbName)
	}
}

module.exports = (cb) => {

	baglan('master.collections', config.mongodb.master, db, (err) => {
		if(!err) {
			initRepoDb()
			baglan('web.collections', config.mongodb.web, dbWeb, (err) => {
				if(!err) {
					baglan('worker.collections', config.mongodb.worker, workerDb, (err) => {
						cb(err)
					})
				} else {
					cb(err)
				}
			})


		} else {
			cb(err)
		}
	})
}

function baglan(collectionFolder, mongoAddress, dbObj, cb) {
	if(collectionFolder && mongoAddress && !dbObj.conn) {
		moduleLoader(path.join(__dirname, collectionFolder), '.collection.js', ``, (err, holder) => {
			if(!err) {
				dbObj.conn = mongoose.createConnection(mongoAddress, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
				dbObj.conn.on('connected', () => {
					Object.keys(holder).forEach((key) => {
						dbObj[key] = holder[key](dbObj.conn)
					})
					if(dbObj.conn.active != undefined) {
						eventLog(`${dbObj.nameLog} ${'re-connected'.green}`)
					} else {
						eventLog(`${dbObj.nameLog} ${'connected'.brightGreen}`)
					}
					dbObj.conn.active = true
					if(cb)
						cb(null, dbObj)
				})

				dbObj.conn.on('error', (err) => {
					dbObj.conn.active = false
					errorLog(`${dbObj.nameLog} Error:\r\n`, err)
					if(cb)
						cb(err)
				})

				dbObj.conn.on('disconnected', () => {
					dbObj.conn.active = false
					eventLog(`${dbObj.nameLog} ${'disconnected'.cyan}`)

				})
			} else {
				if(cb)
					cb(err)
			}
		})
	} else {
		if(cb)
			cb(null, dbObj)
	}
}


global.repoHolder = {}

var serverConn1, serverConn2, serverConn3

function initRepoDb() {
	moduleLoader(path.join(__dirname, 'repo.collections'), '.collection.js', ``, (err, holder) => {
		repoHolder = holder

		if(!err) {
			if(config.mongodb.server1) {
				serverConn1 = mongoose.createConnection(config.mongodb.server1, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true })
				serverConn1.on('connected', () => {
					eventLog(`${config.mongodb.server1.brightBlue} ${'connected'.brightGreen}`)
				})

				serverConn1.on('error', (err) => errorLog(`${config.mongodb.server1.brightBlue} Error:`, err))
				serverConn1.on('disconnected', () => eventLog(`${config.mongodb.server1.brightBlue} disconnected`))
			}
			if(config.mongodb.server2) {
				serverConn2 = mongoose.createConnection(config.mongodb.server2, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true })
				serverConn2.on('connected', () => {
					eventLog(`${config.mongodb.server2.brightBlue} ${'connected'.brightGreen}`)
				})

				serverConn2.on('error', (err) => errorLog(`${config.mongodb.server2.brightBlue} Error:`, err))
				serverConn2.on('disconnected', () => eventLog(`${config.mongodb.server2.brightBlue} disconnected`))
			}

		} else {
			errorLog('refreshRepoDb:', err)
		}
	})
}

global.repoDbModel = function(_id, cb) {
	if(_id == '')
		return dbnull(null, cb)

	db.dbdefines.findOne({ _id: _id, deleted: false, passive: false }, (err, doc) => {
		if(dberr(err, cb)) {
			if(dbnull(doc, cb)) {
				let dbModel = { get nameLog() { return dbNameLog(doc.dbName) } }
				dbModel._id = doc._id
				dbModel.dbName = doc.dbName
				dbModel.enabledServices = doc.services
				dbModel.authorizedMembers = doc.authorizedMembers
				switch (doc.userDbHost) {
					case config.mongodb.server1:
						dbModel.conn = serverConn1.useDb(doc.userDb)
						break
					case config.mongodb.server2:
						dbModel.conn = serverConn2.useDb(doc.userDb)
						break
					case config.mongodb.server3:
						dbModel.conn = serverConn3.useDb(doc.userDb)
						break
				}

				dbModel.free = function() {
					Object.keys(dbModel.conn.models).forEach((key) => {
						delete dbModel.conn.models[key]
						if(dbModel.conn.collections[key] != undefined)
							delete dbModel.conn.collections[key]
						if(dbModel.conn.base != undefined) {
							if(dbModel.conn.base.modelSchemas != undefined)
								if(dbModel.conn.base.modelSchemas[key] != undefined)
									delete dbModel.conn.base.modelSchemas[key]
						}
					})
				}

				Object.keys(repoHolder).forEach((key) => {
					Object.defineProperty(dbModel, key, {
						get: function() {
							if(dbModel.conn.models[key]) {
								return dbModel.conn.models[key]
							} else {
								return repoHolder[key](dbModel)
							}
						}
					})
				})


				cb(null, dbModel)
			}
		}
	})
}


function moduleLoader(folder, suffix, expression, cb) {
	try {
		let moduleHolder = {}
		let files = fs.readdirSync(folder)
		files.forEach((e) => {
			let f = path.join(folder, e)
			if(!fs.statSync(f).isDirectory()) {
				let fileName = path.basename(f)
				let apiName = fileName.substr(0, fileName.length - suffix.length)
				if(apiName != '' && (apiName + suffix) == fileName) {
					moduleHolder[apiName] = require(f)
				}
			}
		})
		cb(null, moduleHolder)
	} catch (e) {
		errorLog(`moduleLoader Error:\r\n\tfolder:${folder}\r\n\tsuffix:${suffix}\r\n\texpression:${expression}`, e)
		cb(e)
	}
}


function dbNameLog(s) {
	return s.padding(20).brightBlue
}


var calisanServiceDatabaseler = {}
global.runServiceOnAllUserDb = (options) => {
	try {
		
		options.repeatInterval = options.repeatInterval || 60000

		let serviceName = options.name || config.name || ''
		let filter = { deleted: false, passive: false }
		filter = Object.assign({}, filter, (options.filter || {}))

		if(!calisanServiceDatabaseler[serviceName]) {
			calisanServiceDatabaseler[serviceName] = {}
		}
		// eventLog(`${serviceName.yellow} filter:`,filter)
		function calistir() {
			db.dbdefines.find(filter).select('_id').exec((err, docs) => {
				if(!err) {
					eventLog(`${serviceName.yellow} ${docs.length.toString().brightBlue} adet db uzerinde calisiyor`)
					docs.forEach((doc) => {
						if(!calisanServiceDatabaseler[serviceName][doc._id]) {
							calisanServiceDatabaseler[serviceName][doc._id] = { working: true }
							repoDbModel(doc._id, (err, dbModel) => {
								if(!err) {
									dbModel.t = (new Date()).getTime()
									options.serviceFunc(dbModel, (err) => {
										let fark = (((new Date()).getTime()) - dbModel.t) / 1000
										if(!err) {
											eventLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} finished in ${fark.toString().yellow} sn`)
										} else {
											errorLog(`${dbModel.dbName.padding(20).brightBlue} ${serviceName.yellow} ${fark.toString().yellow} sn Error:`, err)
										}
										dbModel.free()
										//delete dbModel
										delete calisanServiceDatabaseler[serviceName][doc._id]
										
									})
								} else {
									errorLog(`${serviceName.yellow} error:`, err)
									delete calisanServiceDatabaseler[serviceName][doc._id]
									
								}
							})
						}
					})

					setTimeout(calistir, options.repeatInterval)
				} else {
					errorLog(`${serviceName.yellow} error:`, err)
					setTimeout(calistir, options.repeatInterval)
				}
			})
		}

		setTimeout(calistir, options.repeatInterval)
	} catch (tryErr) {
		errorLog(`try catch error:`, tryErr)
		setTimeout(() => { runServiceOnAllUserDb(options) }, options.repeatInterval)
	}
}


global.dbStats = function(doc, cb) {
	let conn
	switch (doc.userDbHost) {
		case config.mongodb.server1:
			conn = serverConn1.useDb(doc.userDb)
			break
		case config.mongodb.server2:
			conn = serverConn2.useDb(doc.userDb)
			break
		case config.mongodb.server3:
			conn = serverConn3.useDb(doc.userDb)
			break
	}

	if(!conn)
		return cb(null, {})
	conn.db.stats((err, statsObj) => {
		if(!err) {
			console.log(`${doc.dbName} :`, statsObj)
			
			statsObj.dataSizeKb = Number(statsObj.dataSize / 1024).round(2)
			statsObj.dataSizeMb = Number(statsObj.dataSize / (1024 * 1024)).round(2)
			statsObj.dataSizeGb = Number(statsObj.dataSize / (1024 * 1024 * 1024)).round(2)
			statsObj.dataSizeText = `${statsObj.dataSize.toString()} Byte`
			if(statsObj.dataSizeGb > 1) {
				statsObj.dataSizeText = `${statsObj.dataSizeGb} GB`
			} else if(statsObj.dataSizeMb > 1) {
				statsObj.dataSizeText = `${statsObj.dataSizeMb} MB`
			} else if(statsObj.dataSizeKb > 1) {
				statsObj.dataSizeText = `${statsObj.dataSizeKb} KB`
			}

			cb(null, statsObj)
		} else {
			cb(err)
		}
	})
}

global.freeModels = function(conn) {
	Object.keys(conn.models).forEach((key) => {
		delete conn.models[key]
		if(conn.collections[key] != undefined)
			delete conn.collections[key]
		if(conn.base != undefined) {
			if(conn.base.modelSchemas != undefined)
				if(conn.base.modelSchemas[key] != undefined)
					delete conn.base.modelSchemas[key]
		}
	})
}
