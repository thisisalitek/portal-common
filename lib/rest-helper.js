var token='merhaba dunya'

exports.get=(endpoint, params, cb)=>{
	var url=endpoint

	var headers = {
		'token':token
	}

	var options = {
		url: url,
		method: 'GET',
		headers: headers,
		rejectUnauthorized: false,
		qs: params?params:{}
	}

	request(options, (error, response, body)=>{
		
		if(error){
			if(cb){
				return servisCalisiyorMu(error,cb)
			}else{
				return
			}
			
		}
		try{
			var resp=JSON.parse(body)
			if(resp.success){
				if(cb){
					cb(null,resp.data)
				}
			}else{
				if(cb){
					servisCalisiyorMu(resp.error,cb)
				}
			}
		}catch(e){
			if(cb){
				servisCalisiyorMu(e,cb)
			}
		}
	})
}

exports.getFile=(endpoint, params, cb)=>{
	var url=endpoint

	var headers = {
		'token':token
	}

	var options = {
		url: url,
		method: 'GET',
		headers: headers,
		rejectUnauthorized: false,
		qs: params?params:{}
	}

	request(options, (error, response, body)=>{
		if(error){
			if(cb){
				return servisCalisiyorMu(error,cb)
			}else{
				return
			}
		}
		if(cb){
			cb(null,body)
		}
	})
}


exports.post=(endpoint,jsonData, cb)=>{
	var url=endpoint

	var headers = {
		'Content-Type':'application/json;charset=utf-8',
		'token':token
	}

	var options = {
		url: url,
		method: 'POST',
		headers: headers,
		rejectUnauthorized: false,
		json:jsonData,
		dataType:'json'
	}

	request(options, (error, response, body)=>{
		if (!error && response.statusCode==200) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success){
						if(cb){
							cb(null,resp.data)
						}
					}else{
						if(cb){
							servisCalisiyorMu(resp.error)
						}
					}

				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					if(cb)
						cb(null,body.data)
				}else{
					if(cb){
						servisCalisiyorMu(body.error,cb)
					}
				}
			}

		}else{
			if(cb){
				servisCalisiyorMu(error?error:body.error,cb)
			}
		}
	})

}

exports.put=(endpoint, jsonData, cb)=>{
	var url=endpoint

	var headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}

	var options = {
		url: url,
		method: 'PUT',
		headers: headers,
		rejectUnauthorized: false,
		json:jsonData
	}
	request(options, (error, response, body)=>{
		if (!error && response.statusCode==200) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success){
						if(cb){
							cb(null,resp.data)
						}
					}else{
						if(cb){
							servisCalisiyorMu(resp.error,cb)
						}
					}

				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					if(cb){
						cb(null,body.data)
					}
				}else{
					if(cb){
						servisCalisiyorMu(body.error,cb)
					}
				}
			}
		}else{
			if(cb){
				servisCalisiyorMu(error?error:body.error,cb)
			}
		}
	})

}

exports.delete=(endpoint, cb)=>{
	var url=endpoint
	var headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}

	var options = {
		url: url,
		method: 'DELETE',
		rejectUnauthorized: false,
		headers: headers
	}

	request(options, (error, response, body)=>{
		if(error){
			if(cb)
				return servisCalisiyorMu(error,cb)
			else
				return
		}
		try{
			var resp=JSON.parse(body)
			if(resp.success){
				if(cb)
					cb(null,(resp.data || 'ok'))
			}else{
				if(cb)
					servisCalisiyorMu(resp.error,cb)
			}
		}catch(e){
			if(cb){
				servisCalisiyorMu(e,cb)
			}
		}
	})
}

function servisCalisiyorMu(err,cb){
	
	// errorLog(err)
	if(err.code==='ECONNREFUSED'){
		let errObj={
			code:err.code,
			message:`${err.address || ''}:${err.port || 0} Servis calismiyor!`
		}

		mail.sendErrorMail(`${(new Date()).yyyymmddhhmmss()} Rest Service Error`,errObj)
		if(cb){
			cb(errObj)
		}
	}else{
		if(cb){
			cb(err)
		}
	}
}
module.exports=(url)=>{
	return {
		get:function (dbModel, endpoint, params, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			return exports.get(endpoint,params,cb)
		},
		getFile:function (dbModel, endpoint, params, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			return exports.getFile(endpoint,params,cb)
		},
		post:function (dbModel, endpoint, jsonData, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			return exports.post(endpoint, jsonData,cb)
		},
		put:function (dbModel, endpoint, jsonData, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			return exports.put(endpoint,jsonData,cb)
		},
		delete:function (dbModel, endpoint, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			return exports.delete(endpoint,cb)
		}
	}
}
