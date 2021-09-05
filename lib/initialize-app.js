global.fs=require('fs')
global.path=require('path')
global.appName=require(path.join(__root,'package.json')).name
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



let cfg={}
if(fs.existsSync(path.join(__root,'config.json'))){
	cfg=require(path.join(__root,'config.json'))
}else{
	throw {code:'CONFIG_ERROR',message:`config.json dosyasi bulunamadi`}
	process.exit()
}

if((cfg.config_file || '')!=''){
	if(fs.existsSync(cfg.config_file)){
		cfg=require(cfg.config_file)
	}else{
		throw {code:'CONFIG_ERROR',message:`${cfg.config_file} dosyasi bulunamadi`}
		process.exit()
	}
}

global.config={}

Object.keys(cfg || {}).forEach((key)=>{
	if(key!='apps')
		global.config[key]=cfg[key]
})

if(cfg.apps!=undefined){
	Object.keys(cfg.apps[appName] || {}).forEach((key)=>{
		global.config[key]=cfg.apps[appName][key]
	})
}


if(process.argv[2]=='localhost' || process.argv[2]=='-l' || process.argv[2]=='-dev' || process.argv[2]=='-development'){
	global.config.status='development'
}else{
	global.config.status=global.config.status || 'release'
}

global.util = require(path.join(__root,'/lib/util'))
global.mail = require(path.join(__root,'/lib/mail'))

global.taskHelper={}
if(fs.existsSync(path.join(__root,'/lib/taskhelper')))
	global.taskHelper=require(path.join(__root,'/lib/taskhelper'))

global.restServices={}
if(fs.existsSync(path.join(__root,'/lib/rest-helper')))
	Object.keys(config.restServices || {}).forEach((key)=>{
		if(config.restServices[key].enabled===true){
			let uri=config.restServices[key].url || config.restServices[key].uri || ''
			global.restServices[key]=require(path.join(__root,'/lib/rest-helper'))(uri)
		}
	})

tempLog(`${appName}_config.json`,JSON.stringify(config,null,2))

global.appInfo=()=>{
	console.log('-'.repeat(70))
	console.log(`${'Application Name:'.padding(25)} ${app.get('name').brightYellow}`)
	console.log(`${'Version:'.padding(25)} ${app.get('version').yellow}`)
	console.log(`${'Http Port:'.padding(25)} ${(app.get('port') || '').toString().yellow}`)

	Object.keys(cfg.apps[appName] || {}).forEach((key)=>{
		if(!['httpserver','tmpDir','mongodb','status'].includes(key)){
			if(typeof cfg.apps[appName][key]=='object' || Array.isArray(cfg.apps[appName][key])){
				console.log(`${key.padding(25)} ${JSON.stringify(cfg.apps[appName][key],null,4).yellow}`)
			}else{
				console.log(`${key.padding(25)} ${cfg.apps[appName][key].toString().yellow}`)
			}
		}
	})
	Object.keys(config.mongodb || {}).forEach((key)=>{
		console.log(`${key.padding(25)} ${config.mongodb[key].brightYellow}`)
	})
	
	console.log(`${'Passport API:'.padding(25)} ${(config.passport_api || '').cyan}`)
	console.log(`${'Passport Login:'.padding(25)} ${(config.passport_login || '').cyan}`)
	console.log(`${'Temp folder:'.padding(25)} ${config.tmpDir.yellow}`)
	console.log(`${'Running Mode:'.padding(25)} ${config.status.toUpperCase().cyan}`)
	console.log(`${'Uptime Started:'.padding(25)} ${simdi().yellow}`)
	console.log('-'.repeat(70))
}
