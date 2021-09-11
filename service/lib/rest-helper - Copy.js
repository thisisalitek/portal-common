var token='merhaba dunya'
var urllib=require('urllib')

exports.get=(endpoint, params, cb)=>{
	var url=endpoint

	var headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}

	var options = {
		method: 'GET',
		headers: headers,
		rejectUnauthorized: false,
		dataType:'text',
		dataAsQueryString :true,
		data: params?params:{}
	}

	urllib.request(url,options, (error, body, response)=>{
		console.log(`error:`,error)
		console.log(`response:`,response)
		console.log(`body:`,body)
		if(!error) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success)
						return cb(null,resp.data)
					else
						return cb(resp.error || {code:'ERROR',message:'Rest-Helper hata'})
					
				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					return cb(null,body.data)
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

exports.getFile=(endpoint, params, cb)=>{
	var url=endpoint

	var headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}

	var options = {
		method: 'GET',
		headers: headers,
		rejectUnauthorized: false,
		dataAsQueryString :true,
		data: params?params:{}
	}

	urllib.request(url, options, (error, body, response)=>{
		console.log(`error:`,error)
		console.log(`response:`,response)
		console.log(`body:`,body)
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
		method: 'POST',
		headers: headers,
		rejectUnauthorized: false,
		data:jsonData,
		dataType:'json'
	}

	urllib.request(url, options, (error, body, response)=>{
		console.log(`(post) error:`,error)
		console.log(`(post) response:`,response)
		console.log(`(post) body:`,body)
		if(!error) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success)
						return cb(null,resp.data)
					else
						return cb(resp.error || {code:'ERROR',message:'Rest-Helper hata'})
					
				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					return cb(null,body.data)
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

exports.put=(endpoint, jsonData, cb)=>{
	var url=endpoint

	var headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}

	var options = {

		method: 'PUT',
		headers: headers,
		rejectUnauthorized: false,
		data:jsonData,
		dataType:'json'
	}
	urllib.request(url, options, (error, body, response)=>{
		console.log(`(put) error:`,error)
		console.log(`(put) response:`,response)
		console.log(`(put) body:`,body)
		if(!error) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success)
						return cb(null,resp.data)
					else
						return cb(resp.error || {code:'ERROR',message:'Rest-Helper hata'})
					
				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					return cb(null,body.data)
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

exports.delete=(endpoint, cb)=>{
	var url=endpoint
	var headers = {
		'Content-Type':'application/json; charset=utf-8',
		'token':token
	}

	var options = {

		method: 'DELETE',
		rejectUnauthorized: false,
		headers: headers
	}

	urllib.request(url, options, (error, body, response)=>{
		console.log(`(delete) error:`,error)
		console.log(`(delete) response:`,response)
		console.log(`(delete) body:`,body)
		if(!error) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success)
						return cb(null,(resp.data || 'ok'))
					else
						return cb(resp.error || {code:'ERROR',message:'Rest-Helper hata'})
					
				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					return cb(null,(body.data || 'ok'))
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

exports.proxy=(api_uri,req, cb)=>{
	let url=`${api_uri}`
	let endpointParams=Object.keys(req.params || {})
	endpointParams.forEach((key,index)=>{
		if(index>0)
			url+='/'+req.params[key]
	})

	let token = req.body.token || req.query.token || req.headers['x-access-token']  || req.headers['token'] || ''
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
		console.log(`(post) error:`,error)
		console.log(`(post) response:`,response)
		console.log(`(post) body:`,body)
		if(!error) {
			if(typeof body=='string'){
				try{
					var resp=JSON.parse(body)
					if(resp.success)
						return cb(null,resp.data)
					else
						return cb(resp.error || {code:'ERROR',message:'Rest-Helper hata'})
					
				}catch(e){
					if(cb){
						servisCalisiyorMu(e,cb)
					}
				}
			}else{
				if(body.success){
					return cb(null,body.data)
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


module.exports=(url)=>{
	return {
		proxy:function (req, cb){
			
			return exports.proxy(url,req || {},cb)

		},
		all:function (req, cb){
			let endpoint=`${url}`
			let params=Object.keys(req.params || {})
			params.forEach((key,index)=>{
				if(index>0)
					endpoint+='/'+req.params[key]
			})

			if(req.method=='GET')
				return exports.get(endpoint,req.query || {},cb)
			else{
				if(endpoint.indexOf('?')<0)
					endpoint+='?'
				else
					endpoint+='&'
				Object.keys(req.query || {}).forEach((key)=>{
					endpoint+=`${key}=${req.query[key]}&`
				})
				if(endpoint.slice(-1)=='&')
					endpoint=endpoint.slice(0,-1)
				console.log(`endpoint:`,endpoint)
				console.log(`req.body:`,req.body)
				switch(req.method){
					case 'POST':
					return exports.post(endpoint,req.body || {},cb)
					case 'PUT':
					return exports.put(endpoint,req.body || {},cb)
					case 'DELETE':
					return exports.delete(endpoint,cb)
					default:
					return cb({code:'WRONG_METHOD',message:'Rest-Helper Metod hatasi'})
				}
			}

		},
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
