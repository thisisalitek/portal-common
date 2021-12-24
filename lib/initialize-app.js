module.exports = (cb) => {

	global.fs = require('fs')
	global.path = require('path')

	global.sizeOf = require('object-sizeof')
	global.os = require('os')
	global.moment = require('./moment')
	global.moment.updateLocale('tr')
	require('colors')


	Number.prototype.toDigit = function(digit) {
		var t = this
		var s = t.toString()
		if(s.length < digit) {
			s = '0'.repeat(digit - s.length) + s
		}
		return s
	}

	function simdi() {
		var s = yyyymmddhhmmss(new Date())
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

	global.eventLog = function(obj, ...placeholders) {
		console.log(simdi(), obj, ...placeholders)
	}

	global.errorLog = function(obj, ...placeholders) {
		console.error(simdi().red, obj, ...placeholders)
	}


	global.config = {}

	if(fs.existsSync(path.join(__root, 'config.json'))) {
		config = require(path.join(__root, 'config.json'))
	} else {
		throw { code: 'CONFIG_ERROR', message: `config.json dosyasi bulunamadi` }
		process.exit()
	}


	let commonConfig = {}

	if((config.config_file || '') != '') {
		if(fs.existsSync(config.config_file)) {
			commonConfig = require(config.config_file)
		} else {
			throw { code: 'COMMON_CONFIG_ERROR', message: `${config.config_file} dosyasi bulunamadi` }
			process.exit()
		}
	}



	Object.keys(commonConfig || {}).forEach((key) => {
		if(key != 'apps')
			config[key] = commonConfig[key]
	})


	let appName = config.name

	if(commonConfig.apps != undefined) {
		Object.keys(commonConfig.apps[appName] || {}).forEach((key) => {
			global.config[key] = commonConfig.apps[appName][key]
		})
	}


	if(process.argv[2] == 'localhost' || process.argv[2] == '-l' || process.argv[2] == '-dev' || process.argv[2] == '-development') {
		global.config.status = 'development'
	} else {
		global.config.status = global.config.status || 'release'
	}

	global.config.basePaths = global.config.basePaths || global.config.basePath || ['']
	global.util = require('./util')
	global.mail = require('./mail')


	global.taskHelper = {}
	if(fs.existsSync(path.join(__root, 'lib/taskhelper.js')))
		global.taskHelper = require(path.join(__root, 'lib/taskhelper.js'))

	global.restServices = {}
	if(fs.existsSync(path.join(__root, 'lib/rest-helper.js'))) {
		Object.keys(config.restServices || {}).forEach((key) => {
			if(config.restServices[key].enabled === true) {
				let uri = config.restServices[key].url || config.restServices[key].uri || ''
				global.restServices[key] = require('./rest-helper')(uri)
			}
		})
	}


	console.log('-'.repeat(70))
	console.log(`${'Application Name:'.padding(25)} ${(config.name || '').brightYellow}`)
	console.log(`${'Version:'.padding(25)} ${(config.version || '').yellow}`)
	console.log(`${'Http Port:'.padding(25)} ${(config.httpserver.port).toString().yellow}`)

	Object.keys(config.mongodb || {}).forEach((key) => {
		console.log(`${key.padding(25)} ${config.mongodb[key].brightYellow}`)
	})

	console.log(`${'Passport API:'.padding(25)} ${(config.passport_api || '').cyan}`)
	console.log(`${'Passport Login:'.padding(25)} ${(config.passport_login || '').cyan}`)
	console.log(`${'Temp folder:'.padding(25)} ${config.tmpDir.yellow}`)
	console.log(`${'Running Mode:'.padding(25)} ${config.status.toUpperCase().cyan}`)
	console.log(`${'Uptime Started:'.padding(25)} ${simdi().yellow}`)
	console.log('-'.repeat(70))

	cb()
}