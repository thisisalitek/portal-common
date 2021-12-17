
exports.newTask=(dbModel,taskdata,cb)=>{
	baskaCalisanTaskVarmi(dbModel,taskdata,(err,bFound,doc)=>{
		if(!err){
			if(bFound){
				cb(null,doc);
			}else{
				var newDoc=new dbModel.tasks(taskdata);
				newDoc.status='pending';
				newDoc.save((err,newDoc2)=>{
					cb(err,newDoc2);
				});
			}
		}else{
			
			cb(err);
		}
	});
	
}

exports.setRunning=(taskDoc,cb)=>{
	taskDoc.status='running';
	taskDoc.startDate=new Date();
	taskDoc.endDate=new Date();
	taskDoc.save((err)=>{
		if(cb) cb(err);
	});
}

exports.setCompleted=(taskDoc,cb)=>{
	taskDoc.status='completed';
	taskDoc.endDate=new Date();
	taskDoc.save((err)=>{
		if(cb) cb(err);
	});
	
}

exports.setCancelled=(taskDoc,cb)=>{
	taskDoc.status='cancelled';
	taskDoc.endDate=new Date();
	taskDoc.save((err)=>{
		if(cb) cb(err);
	});
}

exports.setPending=(taskDoc,cb)=>{
	taskDoc.status='pending';
	taskDoc.endDate=new Date();
	taskDoc.attemptCount++;
	taskDoc.save((err)=>{
		if(cb) cb(err);
	});
}

exports.setError=(taskDoc,error,cb)=>{
	taskDoc.status='error';
	eventLog('setError:',error);
	taskDoc.endDate=new Date();
	if(error){
		if(Array.isArray(error)){
			error.forEach((e)=>{
				taskDoc.error.push(e);
			});
		}else{
			eventLog('taskDoc.error.push(error):',error);
			taskDoc.error.push(error);
		}
	}
	taskDoc.save((err)=>{
		if(cb) cb(err);
	});
}

function baskaCalisanTaskVarmi(dbModel,taskdata,cb){
	var filter={status:{$in:['running','pending']}};
	if(taskdata.documentId!=undefined){
		filter['documentId']=taskdata.documentId;
		if(taskdata.collectionName!=undefined){
			filter['collectionName']=taskdata.collectionName;
			filter['taskType']=taskdata.taskType;
			dbModel.tasks.findOne(filter,(err,doc)=>{
				if(!err){
					if(doc!=null){
						cb(null,true,doc);
					}else{
						cb(null,false);
					}
				}else{
					cb(err);
				}
			})
		}else{
			cb(null,false);
		}
	}else{
		cb(null,false);
	}
	
}


