var urllib=require('urllib')

module.exports=(url)=>{
	return {
		get:function (dbModel, endpoint, params, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			// return exports.get(endpoint,params,cb)
			return request(endpoint,{method:'GET',body:params}, null, cb)
		},
		getFile:function (dbModel, endpoint, params, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			// return exports.getFile(endpoint,params,cb)
			return requestFile(endpoint,{method:'GET',body:params}, null, cb)
		},
		post:function (dbModel, endpoint, jsonData, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			// return exports.post(endpoint, jsonData,cb)
			return request(endpoint,{method:'POST',body:jsonData}, null, cb)
		},
		put:function (dbModel, endpoint, jsonData, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			// return exports.put(endpoint,jsonData,cb)
			return request(endpoint,{method:'PUT',body:jsonData}, null, cb)
		},
		delete:function (dbModel, endpoint, cb){
			if(dbModel){
				endpoint=`${url}/${dbModel._id}${endpoint}`
			}else{
				endpoint=`${url}${endpoint}`
			}
			return request(endpoint,{method:'DELETE'}, null, cb)
			//return exports.delete(endpoint,cb)
		},
		request:function(endpoint,req,res,cb){
			return request(url+endpoint,req || {}, res, cb)
		},
		proxy:function(req,res,cb){
			let endpoint=''
			if(!req)
				req={}
			Object.keys(req.params || {}).forEach((key,index)=>{
				if(index>0)
					endpoint+='/'+req.params[key]
			})
			return request(url+endpoint,req || {}, res, cb)
		}
	}
}


function request(apiUrl,req,res,cb){
	var endpoint=''
	let url=apiUrl
	
	let token =''
	if(req){
		token=req.token || (req.body || {}).token || (req.query || {}).token || (req.headers || {})['x-access-token']  || (req.headers || {})['token'] || ''
	}
	let headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}
	
	let data=req.query || {}
	data=Object.assign({},data,req.body || {})

	var options = {
		method: req.method,
		headers: headers,
		rejectUnauthorized: false,
		dataType:'json',
		dataAsQueryString :req.method=='GET'?true:false,
		data: data
	}

	urllib.request(url, options, (error, body, response)=>{
		if(!error) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success)
						return cb(null,resp)
					else
						return cb(resp.error || {code:'ERROR',message:'Rest-Helper hata'})
					
				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					return cb(null,body)
				}else{
					return cb(body.error || {code:'ERROR',message:'Rest-Helper hata'})
				}
			}

		}else{
			if(error){
				if(cb)
					return servisCalisiyorMu(error,cb)
				else
					return
			}
		}
	})

}

function requestFile(apiUrl,req,res,cb){
	
	var endpoint=''
	let url=apiUrl
	
	let token =''
	if(req){
		token=req.token || (req.body || {}).token || (req.query || {}).token || (req.headers || {})['x-access-token']  || (req.headers || {})['token'] || ''
	}
	let headers = {
		// 'Content-Type':'application/json; charset=utf-8',
		'token':token
	}
	
	let data=req.query || {}
	data=Object.assign({},data,req.body || {})

	var options = {
		method: req.method,
		headers: headers,
		rejectUnauthorized: false,
		dataType:'text',
		dataAsQueryString :req.method=='GET'?true:false,
		data: data
	}

	urllib.request(url, options, (error, body, response)=>{
		
		if(!error) {
			cb(null,body)
		}else{
			if(error){
				if(cb)
					return servisCalisiyorMu(error,cb)
				else
					return
			}
		}
	})

}


function servisCalisiyorMu(err,cb){
	
	errorLog(err)
	if(err){
		if(err.code!=undefined){
			if(err.code==='ECONNREFUSED'){
				let errObj={
					code:err.code,
					message:`${err.address || ''}:${err.port || 0} Servis calismiyor!`
				}

				mail.sendErrorMail(`${(new Date()).yyyymmddhhmmss()} Rest Service Error`,errObj)
				if(cb){
					return cb(errObj)
				}
			}
		}
	}
	if(cb){
		cb(err)
	}

}