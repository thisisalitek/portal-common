module.exports=(cb)=>{
	global.fs=require('fs')
	global.path=require('path')
	global.appName=require(path.join(__root,'package.json')).name
	global.os=require('os')
	global.os=require('os')

	global.moment=require('./moment')
	global.moment.updateLocale('tr')

	require('colors')


	Number.prototype.toDigit = function(digit){
		var t = this
		var s=t.toString()
		if(s.length<digit){
			s='0'.repeat(digit-s.length) + s
		}
		return s
	}

	function simdi(){
		var s= yyyymmddhhmmss(new Date())
		return s

		
		function yyyymmddhhmmss(tarih) {
			var yyyy = tarih.getFullYear().toDigit(4)
			var mm = (tarih.getMonth() + 1).toDigit(2)
			var dd = tarih.getDate().toDigit(2)
			var HH = tarih.getHours().toDigit(2)
			var min = tarih.getMinutes().toDigit(2)
			var sec = tarih.getSeconds().toDigit(2)

			return `${yyyy}-${mm}-${dd} ${HH}:${min}:${sec}`
		}
	}

	global.eventLog=function(obj,...placeholders){
		console.log(simdi() ,obj,...placeholders)
	}

	global.errorLog=function(obj,...placeholders){
		console.error(simdi().red ,obj,...placeholders)
	}


	global.config={}
	if(fs.existsSync(path.join(__root,'config.json'))){
		global.config=require(path.join(__root,'config.json'))
	}else{
		throw {code:'CONFIG_ERROR',message:`config.json dosyasi bulunamadi`}
		process.exit()
	}


	if(process.argv[2]=='localhost' || process.argv[2]=='-l' || process.argv[2]=='-dev' || process.argv[2]=='-development'){
		global.config.status='development'
	}else{
		global.config.status=global.config.status || 'release'
	}

	global.util = require('./util')


	console.log('-'.repeat(70))
	console.log(`${'Application Name:'.padding(25)} ${(config.name || '').brightYellow}`)
	console.log(`${'Version:'.padding(25)} ${(config.version || '').yellow}`)
	console.log(`${'Http Port:'.padding(25)} ${(config.httpserver.port).toString().yellow}`)

	if(config.base_uri)
		console.log(`${'Base URI:'.padding(25)} ${config.base_uri.cyan}`)
	if(config.api)
		console.log(`${'API URI:'.padding(25)} ${config.api.url.brightYellow}`)
	if(config.login)
		console.log(`${'Login Url:'.padding(25)} ${config.login.url.brightYellow}`)

	console.log(`${'Temp folder:'.padding(25)} ${config.tmpDir.yellow}`)
	console.log(`${'Running Mode:'.padding(25)} ${config.status.toUpperCase().cyan}`)
	console.log(`${'Uptime Started:'.padding(25)} ${simdi().yellow}`)
	console.log('-'.repeat(70))
	cb()
}
