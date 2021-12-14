
exports.yeniFaturaNumarasi=function(dbModel,eIntegratorDoc,newInvoice,cb){
	if(newInvoice.ID.value!='') return cb(null,newInvoice)
	if(newInvoice.issueDate.value.length!=10) return cb(null,newInvoice)
	let prefix=''
	if(eIntegratorDoc.invoice){
		if(newInvoice.ioType==0){
			prefix=eIntegratorDoc.invoice.prefixOutbox
		}else{
			prefix=eIntegratorDoc.invoice.prefixInbox
		}

	}
	if(prefix.length!=3) return cb(null,newInvoice)
	let yil = newInvoice.issueDate.value.substr(0,4)

	dbModel.invoices.find({ioType:newInvoice.ioType, 'ID.value':{'$regex': prefix + yil + '.*','$options':'i'} }).sort({'ID.value':-1}).limit(1).exec((err,docs)=>{
		if(!err){
			let yeniNo=0
			let docNum=prefix + yil
			if(docs.length>0){
				let s=docs[0].ID.value.substr(7)
				if(!isNaN(s)) 
					yeniNo=Number(s)
			}
			yeniNo++
			if(yeniNo.toString().length<9)
				docNum+=Array(9-yeniNo.toString().length).fill('0').join('') + yeniNo
			else
				docNum+=yeniNo

			newInvoice.ID.value=docNum
			return cb(null,newInvoice)
		}else{
			return cb(null,newInvoice)
		}
	})
}


exports.kontrolImportEArsiv=function(dbModel,eIntegratorDoc,newInvoice,cb){
	try{
		if(newInvoice.profileId.value == 'IHRACAT' || newInvoice.profileId.value == 'YOLCUBERABERFATURA' || newInvoice.profileId.value =='EARSIVFATURA') return cb(null,newInvoice)

		let vergiNo=''
		newInvoice.accountingCustomerParty.party.partyIdentification.forEach((e)=>{
			let schemeID=(e.ID.attr.schemeID || '').toUpperCase()
			if(schemeID=='VKN' || schemeID=='TCKN'){
				vergiNo=e.ID.value
				return
			}
		})

		if(vergiNo=='') return cb(null,newInvoice)
		db.einvoice_users.findOne({identifier:vergiNo,enabled:true},(err,doc)=>{
			if(!err){
				if(doc==null){
					eventLog('EARSIVFATURA')
					newInvoice.profileId.value='EARSIVFATURA'
				}
				cb(null,newInvoice)
			}else{
				cb(null,newInvoice)
			}
		})

	}catch(tryErr){
		errorLog('kontrolImportEArsiv:',tryErr)
		cb(null, newInvoice)
	}
}

exports.insertEInvoice=function(dbModel,eIntegratorDoc,connectorResult,callback){
	try{
		eventLog('insertEInvoice started')
		let connInvoices
		if(typeof connectorResult=='string'){
			connInvoices=JSON.parse(connectorResult)
		}

		let invoices=[]
		if(Array.isArray(connInvoices)){
			invoices=connInvoices
		}else{
			invoices.push(connInvoices)
		}
		invoices.forEach((e)=>{
			e.invoiceStatus='Draft'
			e.ioType=0
			e.invoiceErrors=[]
			e.localStatus='transferred'
			e.localErrors=[]
			e.ID=''
			e.eIntegrator=eIntegratorDoc._id
			e.uuid={value:uuid.v4()}
			if(e.localDocumentId==undefined){
				e.localDocumentId=''
			}
			e=util.amountValueFixed2Digit(e,'')
		})

		let index=0
		function kaydet(cb){
			if(index>=invoices.length) return cb(null)
			dbModel.invoices.findOne({ioType:0, localDocumentId:{$ne:''},localDocumentId:invoices[index].localDocumentId},(err,doc)=>{
				if(!err){
					if(doc==null){
						let tempInvoice=(new dbModel.invoices(invoices[index])).toJSON()
						tempInvoice=util.deleteObjectFields(tempInvoice,["_id","__v","createdDate","modifiedDate",'eIntegrator', "pdf", "html"])
						tempInvoice=util.deleteObjectProperty(tempInvoice,'_id')

						let data1=util.eDocumentSetCurrencyIDs(tempInvoice,tempInvoice.documentCurrencyCode.value)
						data1['eIntegrator']=eIntegratorDoc._id
						let newEInvoice=new dbModel.invoices(data1)

						exports.yeniFaturaNumarasi(dbModel,eIntegratorDoc,newEInvoice,(err,newEInvoice2)=>{
							eInvoiceHelper.kontrolImportEArsiv(dbModel,eIntegratorDoc,newEInvoice2,(err,newEInvoice3)=>{
								newEInvoice3.save((err,newDoc)=>{
									if(err){
										eventLog('insertEInvoice newEInvoice.save Error:',err)
									}else{
										eventLog('insertEInvoice newEInvoice.save OK _id:',newDoc._id)
									}
									index++
									setTimeout(kaydet,0,cb)
								})
							})
						})

					}else{
						eventLog('localDocumentId zaten var:',invoices[index].localDocumentId)
						index++
						setTimeout(kaydet,0,cb)
					}
				}else{
					cb({code: err.name, message: err.message})
				}
			})

		}

		kaydet((err)=>{
			if(err){
				errorLog('insertEInvoice kaydet error:',err)
			}else{
				eventLog('insertEInvoice kaydet basarili')
			}

			callback(err)
		})

	}catch(tryErr){
		errorLog('insertEInvoice tryErr:',tryErr)
		callback({code:tryErr.name,message:tryErr.message})
	}
}



exports.yeniIrsaliyeNumarasi=function(dbModel,eIntegratorDoc,newDespatch,cb){
	if(newDespatch.ID.value!='')
		return cb(null,newDespatch)
	if(newDespatch.issueDate.value.length!=10)
		return cb(null,newDespatch)
	let prefix=''
	if(eIntegratorDoc.despatch){
		if(newDespatch.ioType==0){
			prefix=eIntegratorDoc.despatch.prefixOutbox
		}else{
			prefix=eIntegratorDoc.despatch.prefixInbox
		}

	}
	if(prefix.length!=3)
		return cb(null,newDespatch)
	let yil = newDespatch.issueDate.value.substr(0,4)

	dbModel.despatches.find({ioType:newDespatch.ioType, 'ID.value':{'$regex': prefix + yil + '.*','$options':'i'} }).sort({'ID.value':-1}).limit(1).exec((err,docs)=>{
		if(!err){
			let yeniNo=0
			let docNum=prefix + yil
			if(docs.length>0){
				let s=docs[0].ID.value.substr(7)
				if(!isNaN(s))
					yeniNo=Number(s)
			}
			yeniNo++
			if(yeniNo.toString().length<9)
				docNum+=Array(9-yeniNo.toString().length).fill('0').join('') + yeniNo
			else
				docNum+=yeniNo

			newDespatch.ID.value=docNum
			return cb(null,newDespatch)
		}else{
			return cb(null,newDespatch)
		}
	})
}


exports.yeniIrsaliyeYanitNumarasi=function(dbModel,eIntegratorDoc,newReceiptAdvice,cb){
	if(newReceiptAdvice.ID.value!='')
		return cb(null,newReceiptAdvice)
	if(newReceiptAdvice.issueDate.value.length!=10)
		return cb(null,newReceiptAdvice)
	let prefix=''
	if(eIntegratorDoc.despatch){
		if(newReceiptAdvice.ioType==0){
			prefix=eIntegratorDoc.despatch.prefixReceiptAdviceOutbox || 'TES'
		}else{
			prefix=eIntegratorDoc.despatch.prefixReceiptAdviceInbox || 'TES'
		}

	}
	if(prefix.length!=3)
		return cb(null,newReceiptAdvice)
	let yil = newReceiptAdvice.issueDate.value.substr(0,4)

	dbModel.despatches_receipt_advice.find({ioType:newReceiptAdvice.ioType, 'ID.value':{'$regex': prefix + yil + '.*','$options':'i'} }).sort({'ID.value':-1}).limit(1).exec((err,docs)=>{
		if(!err){
			let yeniNo=0
			let docNum=prefix + yil
			if(docs.length>0){
				let s=docs[0].ID.value.substr(7)
				if(!isNaN(s)) yeniNo=Number(s)
			}
			yeniNo++
			if(yeniNo.toString().length<9)
				docNum+=Array(9-yeniNo.toString().length).fill('0').join('') + yeniNo
			else
				docNum+=yeniNo

			newReceiptAdvice.ID.value=docNum
			return cb(null,newReceiptAdvice)
		}else{
			return cb(null,newReceiptAdvice)
		}
	})
}



exports.insertEDespatch=function(dbModel,eIntegratorDoc,connectorResult,callback){
	try{

		eventLog('insertEDespatch started')
		let connDespatches
		if(typeof connectorResult=='string'){
			if(connectorResult.trim()=='')
				return callback({code:'IMPORT_ERROR',message:'Iceri alinacak kayit gorunmuyor'})
			connDespatches=JSON.parse(connectorResult)
		}
		

		let despatches=[]
		if(Array.isArray(connDespatches)){
			despatches=connDespatches
		}else{
			despatches.push(connDespatches)
		}
		despatches.forEach((e)=>{
			e.despatchStatus='Draft'
			e.ioType=0
			e.despatchErrors=[]
			e.localStatus='transferred'
			e.localErrors=[]
			e.ID={value:''}
			e.eIntegrator=eIntegratorDoc._id
			e.uuid={value:uuid.v4()}
			if(e.localDocumentId==undefined){
				e.localDocumentId=''
			}
			//e=util.amountValueFixed2Digit(e,'')
		})

		let index=0
		function kaydet(cb){
			if(index>=despatches.length) return cb(null)
			dbModel.despatches.findOne({ioType:0, localDocumentId:{$ne:''},localDocumentId:despatches[index].localDocumentId},(err,doc)=>{
				if(!err){
					if(doc==null){
						let tempDespatch=(new dbModel.despatches(despatches[index])).toJSON()
						tempDespatch=util.deleteObjectFields(tempDespatch,["_id","__v","createdDate","modifiedDate",'eIntegrator', "pdf", "html"])
						tempDespatch=util.deleteObjectProperty(tempDespatch,'_id')

						if(!tempDespatch.location)
							tempDespatch.location=undefined
						if(!tempDespatch.location2)
							tempDespatch.location2=undefined
						if(!tempDespatch.subLocation)
							tempDespatch.subLocation=undefined
						if(!tempDespatch.subLocation2)
							tempDespatch.subLocation2=undefined
                        //var data1=util.eDocumentSetCurrencyIDs(tempDespatch,tempDespatch.documentCurrencyCode.value)
                        var data1=tempDespatch

                        data1['eIntegrator']=eIntegratorDoc._id

                        var newDespatch=new dbModel.despatches(data1)

                        exports.yeniIrsaliyeNumarasi(dbModel,eIntegratorDoc,newDespatch,(err,newDespatch2)=>{
	                        newDespatch2.save((err,newDoc)=>{
	                        	if(err){
	                        		eventLog('insertEDespatch newDespatch.save Error:',err)
	                        		return cb(err)
	                        	}else{
	                        		eventLog('insertEDespatch newDespatch.save OK _id:',newDoc._id)
	                        	}
	                        	index++
	                        	setTimeout(kaydet,0,cb)
	                        })
                        })

                        
                    }else{
                    	eventLog('localDocumentId zaten var:',despatches[index].localDocumentId)
                    	index++
                    	setTimeout(kaydet,0,cb)
                    }
                }else{
                	cb({code: err.name, message: err.message})
                }
            })

		}

		kaydet((err)=>{
			if(err){
				errorLog('insertEDespatch kaydet error:',err)
			}else{
				eventLog('insertEDespatch kaydet basarili')
			}

			callback(err)
		})

	}catch(tryErr){
		errorLog('insertEDespatch tryErr:',tryErr)
		callback({code:tryErr.name,message:tryErr.message})
	}
}


exports.findDefaultEIntegrator=function(dbModel,eIntegratorId,callback){

	let filter={passive:false}
	if(eIntegratorId){
		filter['_id']=eIntegratorId
	}
	dbModel.integrators.find(filter).exec((err,docs)=>{
		if(!err){
			if(docs.length==0) return callback({code:'RECORD_NOT_FOUND',message:'Aktif GIB entegrator bulunamadi'})
			if(docs.length==1) return callback(null,docs[0])
			let bFoundDefault=false
			let foundDoc
			docs.forEach((e)=>{
				if(e.isDefault){
					bFoundDefault=true
					foundDoc=e
					return
				}
			})
			if(bFoundDefault) 
				return callback(null,foundDoc)
			callback(null,docs[0])

		}else{
			callback(err)
		}
	})
}

exports.yeniSiparisNumarasi=function(dbModel,eIntegratorDoc,newOrder,cb){
	if(newOrder.ID.value!='') return cb(null,newOrder)
	if(newOrder.issueDate.value.length!=10) return cb(null,newOrder)
	let prefix=''
	if(eIntegratorDoc.order){
		if(newOrder.ioType==0){
			prefix=eIntegratorDoc.order.prefixOutbox
		}else{
			prefix=eIntegratorDoc.order.prefixInbox
		}

	}
	if(prefix.length!=3) return cb(null,newOrder)
	let yil = newOrder.issueDate.value.substr(0,4)

	dbModel.orders.find({ioType:newOrder.ioType, 'ID.value':{'$regex': prefix + yil + '.*','$options':'i'} }).sort({'ID.value':-1}).limit(1).exec((err,docs)=>{
		if(!err){
			let yeniNo=0
			let invoiceNum=prefix + yil
			if(docs.length>0){
				let s=docs[0].ID.value.substr(7)
				if(!isNaN(s)) yeniNo=Number(s)
			}
			yeniNo++
			if(yeniNo.toString().length<9){
				for(var i=0;i<(9-yeniNo.toString().length);i++){
					invoiceNum +='0'
				}
			}
			invoiceNum +=yeniNo.toString()
			newOrder.ID.value=invoiceNum

			return cb(null,newOrder)
		}else{
			return cb(null,newOrder)
		}
	})
}

exports.yeniUretimNumarasi=function(dbModel,newProductionOrder,cb){
	if(newProductionOrder.productionId!='') return cb(null,newProductionOrder)

	dbModel.production_orders.find({productionId:{$ne:''} }).sort({productionId:-1}).limit(1).exec((err,docs)=>{
		if(!err){
			let yeniNo='000000'
			if(docs.length>0){
				yeniNo=docs[0].productionId
			}
			newProductionOrder.productionId=util.incString(yeniNo)

			return cb(null,newProductionOrder)
		}else{
			return cb(null,newProductionOrder)
		}
	})
}



exports.yeniIrsaliyeNumarasi=function(dbModel,eIntegratorDoc,newDespatch,cb){
	if(newDespatch.ID.value!='') return cb(null,newDespatch)
	if(newDespatch.issueDate.value.length!=10) return cb(null,newDespatch)
	let prefix=''
	if(eIntegratorDoc.despatch){
		if(newDespatch.ioType==0){
			prefix=eIntegratorDoc.despatch.prefixOutbox
		}else{
			prefix=eIntegratorDoc.despatch.prefixInbox
		}

	}
	if(prefix.length!=3) return cb(null,newDespatch)
	let yil = newDespatch.issueDate.value.substr(0,4)

	dbModel.despatches.find({ioType:newDespatch.ioType, 'ID.value':{'$regex': prefix + yil + '.*','$options':'i'} }).sort({'ID.value':-1}).limit(1).exec((err,docs)=>{
		if(!err){
			let yeniNo=0
			let invoiceNum=prefix + yil
			if(docs.length>0){
				let s=docs[0].ID.value.substr(7)
				if(!isNaN(s)) yeniNo=Number(s)
			}
			yeniNo++
			if(yeniNo.toString().length<9){
				for(var i=0;i<(9-yeniNo.toString().length);i++){
					invoiceNum +='0'
				}
			}
			invoiceNum +=yeniNo.toString()
			newDespatch.ID.value=invoiceNum
			return cb(null,newDespatch)
		}else{
			return cb(null,newDespatch)
		}
	})
}

exports.yeniStokFisNumarasi=function(dbModel,newInventoryFiche,cb){
	if((newInventoryFiche.docId || '').trim()!='') return cb(null,newInventoryFiche)

	let prefix='ST'

	dbModel.inventory_fiches.find({docId:{'$regex': prefix + '.*','$options':'i'} }).sort({docId:-1}).limit(1).exec((err,docs)=>{
		if(!err){

			if(docs.length>0){
				newInventoryFiche.docId=util.incString(docs[0].docId)
			}else{
				newInventoryFiche.docId=prefix + '000001'
			}

			return cb(null,newInventoryFiche)
		}else{
			return cb(null,newInventoryFiche)
		}
	})
}