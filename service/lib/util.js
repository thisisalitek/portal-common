var htmlToText = require('html-to-text')
var bcrypt = require('bcrypt-nodejs')
global.js2xmlparser = require('js2xmlparser')
global.ejs = require('ejs')
global.uuid = require('uuid')

global.atob = require('atob')
global.btoa = require('btoa')

require('colors')



Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString()
	var mm = (this.getMonth() + 1).toString()
	var dd = this.getDate().toString()
	var HH = this.getHours().toString()
	var min = this.getMinutes().toString()
	var sec = this.getSeconds().toString()
	return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0])
}

Date.prototype.yyyymmddhhmmss = function(middleChar) {
	var yyyy = this.getFullYear().toString()
	var mm = (this.getMonth() + 1).toString()
	var dd = this.getDate().toString()
	var HH = this.getHours().toString()
	var min = this.getMinutes().toString()
	var sec = this.getSeconds().toString()
	return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + (middleChar ? middleChar : ' ') + (HH[1] ? HH : "0" + HH[0]) + ':' + (min[1] ? min : "0" + min[0]) + ':' + (sec[1] ? sec : "0" + sec[0])
}

Date.prototype.hhmmss = function(middleChar) {

	var HH = this.getHours().toString()
	var min = this.getMinutes().toString()
	var sec = this.getSeconds().toString()
	return (HH[1] ? HH : "0" + HH[0]) + ':' + (min[1] ? min : "0" + min[0]) + ':' + (sec[1] ? sec : "0" + sec[0])
}

Date.prototype.yyyymmddmilisecond = function() {
	var yyyy = this.getFullYear().toString()
	var mm = (this.getMonth() + 1).toString()
	var dd = this.getDate().toString()
	var HH = this.getHours().toString()
	var min = this.getMinutes().toString()
	var sec = this.getSeconds().toString()
	var msec = this.getMilliseconds().toString()
	return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + ' ' + (HH[1] ? HH : "0" + HH[0]) + ':' + (min[1] ? min : "0" + min[0]) + ':' + (sec[1] ? sec : "0" + sec[0]) + ':' + msec
}


Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days)
	return dat
}

Date.prototype.lastThisMonth = function() {
	var dat = new Date(this.valueOf());
	dat = new Date((new Date(dat.setMonth(dat.getMonth() + 1))).setDate(0))
	return dat
}

exports.timeStamp = function() { return (new Date).yyyymmddhhmmss() };


exports.datefromyyyymmdd = function(text) {
	var yyyy = Number(text.substring(0, 4))
	var mm = Number(text.substring(5, 7))
	var dd = Number(text.substring(8, 10))
	var tarih = new Date(yyyy, mm - 1, dd, 5, 0, 0)

	return tarih
}

Date.prototype.yyyymmddhhmmss = function(middleChar) {
	var yyyy = this.getFullYear().toString()
	var mm = (this.getMonth() + 1).toString();
	var dd = this.getDate().toString()
	var HH = this.getHours().toString()
	var min = this.getMinutes().toString()
	var sec = this.getSeconds().toString()
	return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + (middleChar ? middleChar : ' ') + (HH[1] ? HH : "0" + HH[0]) + ':' + (min[1] ? min : "0" + min[0]) + ':' + (sec[1] ? sec : "0" + sec[0]);
}


exports.wait = function(milisecond) {
	var t = new Date().getTime()
	while(t + milisecond > new Date().getTime()) {
		setTimeout('', 5)
	}

	return
}



String.prototype.replaceAll = function(search, replacement) {
	var target = this
	return target.split(search).join(replacement)

}

exports.replaceAll = function(search, replacement) {
	var target = this
	return target.replace(new RegExp(search, 'g'), replacement)
}

exports.sayMerhaba = function() {
	return new Date().getTime().toString()
}


exports.validEmail = function(email) {

	return require('email-validator').validate(email)
}

exports.validTelephone = function(tel) {
	if(tel.trim() == '') return false
	var bFound = false
	for(var i = 0; i < tel.length; i++) {
		if(!((tel[i] >= '0' && tel[i] <= '9') || tel[i] == '+')) {
			return false
		}
	}
	return true
}


Date.prototype.monthName = function(language) {


	language = language || 'TR';

	var monthNames = []
	switch (language) {
		case 'TR':
		case 'tr':
			monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
			break
		default:
			monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			break
	}

	return monthNames[this.getMonth()]
}

// exports.trimNumbers=function(text){
//     return text.replace( /^\D+/g, '')
// }


exports.trimNumbers = function(text) {
	var buf = ''
	for(var i = 0; i < text.length; i++) {
		if(text[i] >= '0' && text[i] <= '9') {
			buf += text[i]
		}
	}

	return buf
}

exports.namecode = function(text) {
	text = text.toLowerCase()
	text = text.replaceAll('İ', 'i')
	text = text.replaceAll('ı', 'i')
	text = text.replaceAll('Ğ', 'g')
	text = text.replaceAll('ğ', 'g')
	text = text.replaceAll('Ü', 'u')
	text = text.replaceAll('ü', 'u')
	text = text.replaceAll('Ö', 'o')
	text = text.replaceAll('ö', 'o')
	text = text.replaceAll('Ş', 's')
	text = text.replaceAll('ş', 's')
	text = text.replaceAll('Ç', 'c')
	text = text.replaceAll('ç', 'c')
	text = text.replaceAll('  ', ' ')
	text = text.replaceAll('  ', ' ')
	text = text.replaceAll('  ', ' ')
	text = text.replaceAll('  ', ' ')
	text = text.replaceAll('  ', ' ')
	text = text.replaceAll('.', '')
	text = text.replaceAll(',', '')
	text = text.replaceAll('-', '')
	text = text.replaceAll('_', '')
	text = text.replaceAll('+', '')
	text = text.replaceAll('#', '')
	text = text.replaceAll('$', '')
	text = text.replaceAll('%', '')
	text = text.replaceAll('^', '')
	text = text.replaceAll('&', '')
	text = text.replaceAll('*', '')
	text = text.replaceAll("'", '')

	for(i = 20; i > 1; i--) {
		var buf = ''
		for(j = 0; j < i; j++) {
			buf = buf + ' '
		}
		text = text.replaceAll(buf, ' ')
	}
	return text
}

String.prototype.lcaseeng = function() {
	var text = this.toLowerCase()
	text = text.replaceAll('İ', 'i')
	text = text.replaceAll('ı', 'i')
	text = text.replaceAll('I', 'i')
	text = text.replaceAll('Ğ', 'g')
	text = text.replaceAll('ğ', 'g')
	text = text.replaceAll('Ü', 'u')
	text = text.replaceAll('ü', 'u')
	text = text.replaceAll('Ö', 'o')
	text = text.replaceAll('ö', 'o')
	text = text.replaceAll('Ş', 's')
	text = text.replaceAll('ş', 's')
	text = text.replaceAll('Ç', 'c')
	text = text.replaceAll('ç', 'c')

	var sbuf = ''
	for(var i = 0; i < text.length; i++) {
		if(text.charCodeAt(i) <= 127) {
			sbuf = sbuf + text[i]
		}
	}
	return sbuf
}

String.prototype.ucaseeng = function() {
	var text = this.lcaseeng()
	text = text.toUpperCase()

	return text
}

String.prototype.upcaseTr = function() {
	var text = this
	text = text.replaceAll('i', 'İ')
	text = text.replaceAll('ı', 'I')
	text = text.replaceAll('ğ', 'Ğ')
	text = text.replaceAll('ü', 'Ü')
	text = text.replaceAll('ş', 'Ş')
	text = text.replaceAll('ö', 'Ö')
	text = text.replaceAll('ç', 'Ç')


	text = this.toUpperCase()

	return text
}

String.prototype.lcaseTr = function() {
	var text = this
	text = text.replaceAll('İ', 'i')
	text = text.replaceAll('I', 'ı')
	text = text.replaceAll('Ğ', 'ğ')
	text = text.replaceAll('Ü', 'ü')
	text = text.replaceAll('Ş', 'ş')
	text = text.replaceAll('Ö', 'ö')
	text = text.replaceAll('Ç', 'ç')


	text = this.toLowerCase()

	return text
}

String.prototype.briefCase = function() {
	var text = this.lcaseTr().trim()
	var newtext = ''
	for(var i = 0; i < text.length; i++) {
		if(i == 0) {
			newtext = newtext + text.substr(i, 1).upcaseTr()
		} else {
			if(text.substr(i - 1, 1) == ' ' && text.substr(i, 1) != ' ') {
				newtext = newtext + text.substr(i, 1).upcaseTr()
			} else {
				newtext = newtext + text.substr(i, 1)
			}
		}
	}

	return newtext
}

String.prototype.lcaseTr2 = function() {
	var text = this.lcaseTr().trim()
	var newtext = ''
	if(text.length > 0) {
		text = text[0].upcaseTr()
	}


	return text
}

exports.repairText = function(text) {
	text = text.replaceAll("&#8217;", "'")
	text = text.replaceAll("&#8211;", "-")
	return text
}
exports.downloadImage = function(url, folder, filename, callback) {
	request.head(url, function(err, res, body) {
		// eventLog('content-type:', res.headers['content-type'])
		// eventLog('content-length:', res.headers['content-length'])
		// eventLog('err:' + JSON.stringify(err))
		if(res.headers['content-length'] == undefined || res.headers['content-type'].split('/')[0] != 'image') {
			callback({ success: false, error: { code: 'DOWNLOAD_URL_ERROR', message: 'Content not found.' } })
		} else {
			if(err != null) {
				callback({ success: false, error: { code: 'DOWNLOAD_FILE_ERROR', message: err } })
			} else {
				switch (res.headers['content-type'].split('/')[1]) {
					case 'jpeg':
						filename += '.jpg'
						break
					case 'png':
						filename += '.png'
						break
					case 'bmp':
						filename += '.bmp'
						break
					case 'gif':
						filename += '.gif'
						break
					default:
						filename += '.jpg'
						break
				}
				request(url).pipe(fs.createWriteStream(folder + '/' + filename)).on('close', function() {
					callback({ success: true, error: null, data: { filename: filename } })
				})
			}
		}


	})
}

exports.copyFile = function(source, target, callback) {
	var cbCalled = false

	var rd = fs.createReadStream(source)
	rd.on("error", function(err) {
		done(err)
	})
	var wr = fs.createWriteStream(target)
	wr.on("error", function(err) {
		done(err)
	})
	wr.on("close", function(ex) {
		done()
	})
	rd.pipe(wr)

	function done(err) {
		if(!cbCalled) {
			cbCalled = true
			if(err) {
				callback({ success: false, error: { code: 'COPY_FILE_ERROR', message: err } })
			} else {
				callback({ success: true, error: null })
			}

		}
	}
}

exports.clearText = function(text) {
	return htmlToText.fromString(text, { wordwrap: 255 })
}


exports.randomNumber = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

exports.distance = function(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295; // Math.PI / 180
	var c = Math.cos
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2

	return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

exports.distanceToCoords = function(lat, lon, distance) {
	var lat2, lon2
	var birimfark_lat
	var birimfark_lon
	var result = { minlat: 0, maxlat: 0, minlon: 0, maxlon: 0 }
	var buf
	var farklat = 0,
		farklon = 0
	lat2 = lat + 1
	lon2 = lon + 1
	birimfark_lat = exports.distance(lat, lon, lat2, lon)
	birimfark_lon = exports.distance(lat, lon, lat, lon2)
	if(birimfark_lat != 0) farklat = Math.abs(distance / birimfark_lat)
	if(birimfark_lon != 0) farklon = Math.abs(distance / birimfark_lon)
	result.minlat = lat - farklat
	result.maxlat = lat + farklat
	result.minlon = lon - farklon
	result.maxlon = lon + farklon
	return result
}

exports.nameMask = function(text) {
	var buf = ''
	if(text.length == 0) return ''
	//buf=text
	for(var i = 0; i < text.length; i++) {
		if(i == 0) {
			buf = buf + text[i]
		} else {
			if(text[i - 1] == ' ' && text[i] != ' ') {
				buf = buf + text[i]
			} else {
				if(text[i] == ' ') {
					buf = buf + ' '
				} else {
					buf = buf + '.'
				}

			}
		}
	}

	return buf
}


exports.dynamicSort = function(property) {
	var sortOrder = 1
	if(property[0] === "-") {
		sortOrder = -1
		property = property.substr(1)
	}
	return function(a, b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
		return result * sortOrder
	}
}

// exports.base64ArrayBuffer=function(arrayBuffer) {
// 	var base64    = ''
// 	var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

// 	var bytes         = new Uint8Array(arrayBuffer)
// 	var byteLength    = bytes.byteLength
// 	var byteRemainder = byteLength % 3
// 	var mainLength    = byteLength - byteRemainder

// 	var a, b, c, d
// 	var chunk

//   // Main loop deals with bytes in chunks of 3
//   for (var i = 0; i < mainLength; i = i + 3) {
//     // Combine the three bytes into a single integer
//     chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

//     // Use bitmasks to extract 6-bit segments from the triplet
//     a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
//     b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
//     c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
//     d = chunk & 63               // 63       = 2^6 - 1

//     // Convert the raw binary segments to the appropriate ASCII encoding
//     base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
//   }

//   // Deal with the remaining bytes and padding
//   if (byteRemainder == 1) {
//   	chunk = bytes[mainLength]

//     a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

//     // Set the 4 least significant bits to zero
//     b = (chunk & 3)   << 4 // 3   = 2^2 - 1

//     base64 += encodings[a] + encodings[b] + '=='
//   } else if (byteRemainder == 2) {
//   	chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

//     a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
//     b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

//     // Set the 2 least significant bits to zero
//     c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

//     base64 += encodings[a] + encodings[b] + encodings[c] + '='
//   }

//   return base64
// }

exports.strToDate = function(text) {
	var gun = text.substr(0, 2); //29.01.2007
	var ay = text.substr(3, 2)
	var yil = text.substr(6, 4)

	return new Date(yil, ay, gun)

}


Number.prototype.formatMoney = function(c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "")
}

Number.prototype.round = function(precision) {
	var t = this
	var rakam = 1
	if(precision <= 0)
		return Math.round(t)
	for(var i = 0; i < precision; i++) {
		rakam = rakam * 10
	}
	var sonuc = Math.round(rakam * t) / rakam

	return sonuc

}
Number.prototype.toDigit = function(digit) {
	var t = this
	var s = t.toString()
	if(s.length < digit) {
		s = '0'.repeat(digit - s.length) + s
	}
	return s
}
exports.deleteObjectFields = function(obj, fields) {
	if(obj != undefined) {
		if(typeof obj['limit'] != 'undefined' && typeof obj['totalDocs'] != 'undefined' && typeof obj['totalPages'] != 'undefined' && typeof obj['page'] != 'undefined') {
			obj['pageSize'] = obj.limit
			obj.limit = undefined
			delete obj.limit

			obj['recordCount'] = obj.totalDocs
			obj.totalDocs = undefined
			delete obj.totalDocs

			obj['pageCount'] = obj.totalPages
			obj.totalPages = undefined
			delete obj.totalPages

		}
	}

	if(obj == undefined || fields == undefined) return obj
	if(obj == null || fields == null) return obj

	for(var key in obj) {

		if(fields.indexOf(key.toString()) >= 0) {
			obj[key] = undefined
			delete obj[key]
		}

	}

	return obj
}

exports.isValidPassword = function(normal_password, kriptolanmis_password) {
	return bcrypt.compareSync(normal_password, kriptolanmis_password)
}



exports.createHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

exports.getdim = function(arr) {
	if(!Array.isArray(arr)) {
		return 0;
	} else {
		if(!Array.isArray(arr[0])) {
			return 1
		} else {
			return 1 + getdim(arr[0])
		}
	}
}


exports.mongoDate = function(dateStr) {
	d = new Date(dateStr);
	d.setMinutes(d.getMinutes() + (new Date()).getTimezoneOffset() * 1)
	eventLog(d.toISOString())
	return d.toISOString()
}

exports.round = function(number, decimalPlaces) {

	number = isNaN(number) ? 0 : number
	decimalPlaces = !decimalPlaces ? 0 : decimalPlaces

	var multiple = Math.pow(10, decimalPlaces)
	return Math.round(number * multiple) / multiple
}

exports.renameObjectProperty = function(obj, renameFunction) {

	if(Array.isArray(obj)) {
		var newObj = []
		for(var i = 0; i < obj.length; i++) {
			newObj.push(exports.renameObjectProperty(obj[i], renameFunction))
		}
		return newObj
	} else if(typeof obj === 'object') {
		var newObj = {}

		var keys = Object.keys(obj)
		keys.forEach((key) => {
			var newKey = renameFunction(key)
			if(Array.isArray(obj[key]) || typeof obj[key] === 'object') {
				newObj[newKey] = exports.renameObjectProperty(obj[key], renameFunction)
			} else {
				newObj[newKey] = obj[key]
			}
		})
		return newObj
	} else {
		return obj
	}
}

exports.deleteObjectProperty = function(obj, propertyName) {
	if(obj == null) return {}

	if(Array.isArray(obj)) {
		// eventLog('typeof obj: array[] length:',obj.length)
		var newObj = []
		for(var i = 0; i < obj.length; i++) {
			newObj.push(exports.deleteObjectProperty(obj[i], propertyName))
		}
		return newObj
	} else if(typeof obj === 'object') {
		var newObj = {}

		if(obj[propertyName] != undefined) {
			obj[propertyName] = undefined
			delete obj[propertyName]
		}
		if(propertyName.indexOf('*') > -1) {
			var keys = Object.keys(obj)
			var s = propertyName.replaceAll('*', '')
			keys.forEach((e) => {
				if(e.indexOf(s) > -1) {
					obj[e] = undefined
					delete obj[e]
				}
			})
		}

		var keys = Object.keys(obj)
		keys.forEach((key) => {
			// eventLog('key:',key)
			if(Array.isArray(obj[key]) || typeof obj[key] === 'object') {
				// eventLog('typeof obj:',(typeof obj),key)
				newObj[key] = exports.deleteObjectProperty(obj[key], propertyName)
			} else {
				newObj[key] = obj[key]
			}
		})

		return newObj
	} else {
		return obj
	}
}



exports.xml2json = function(xmlstring, cb) {
	parseString(xmlstring, cb)
}

exports.xml2json3 = function(xmlstring, cb) {
	parseString(xmlstring, { ignoreAttrs: false, mergeAttrs: false, xmlns: false, explicitArray: false, charkey: 'value', attrkey: '$' }, cb)
}

exports.e_invoice2xml = function(invoiceObject, rootName = 'Invoice') {
	var jsObject = JSON.parse(JSON.stringify(invoiceObject))

	jsObject = exports.deleteObjectFields(jsObject, ["_id", "createdDate", "modifiedDate", "deleted", "__v", "eIntegrator", 'ioType', 'invoiceErrors', 'invoiceStatus', 'localStatus', 'localErrors', 'pdf', 'html', 'invoiceXslt', 'invoiceXsltFiles'])
	jsObject = exports.deleteObjectProperty(jsObject, '_id')

	if(jsObject.invoiceLine != undefined) {

		jsObject.invoiceLine.forEach((line) => {
			if(line.taxTotal != undefined) {
				if(line.taxTotal.taxAmount != undefined) {
					if(line.taxTotal.taxAmount.value == 0 && line.taxTotal.taxSubtotal == undefined) {
						line.taxTotal = undefined
						delete line.taxTotal

					}
				}
			}
			if(line.item)
				if(line.item.originCountry)
					if(line.item.originCountry.identificationCode)
						if((line.item.originCountry.identificationCode.value || '') == '') {
							line.item.originCountry = undefined
							delete line.item.originCountry
							eventLog('calisti delete line.item.originCountry;')
						}
		})
	}

	jsObject = einvoiceXmlHazirla(jsObject)

	var options = {
		attributeString: 'attr',
		valueString: 'value',
		declaration: {
			include: false,
			encoding: 'UTF-8',
			version: '1.0'
		},
		format: {
			doubleQuotes: true
		}
	}
	var invoiceAttr = {
		'xmlns:ds': "http://www.w3.org/2000/09/xmldsig#",
		'xmlns:qdt': "urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2",
		'xmlns:cctc': "urn:un:unece:uncefact:documentation:2",
		'xmlns:ubltr': "urn:oasis:names:specification:ubl:schema:xsd:TurkishCustomizationExtensionComponents",
		'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
		'xmlns:udt': "urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2",
		'xmlns:cac': "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
		'xmlns:ext': "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
		'xmlns:cbc': "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
		'xmlns:xades': "http://uri.etsi.org/01903/v1.3.2#",
		'xsi:schemaLocation': "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 UBL-Invoice-2.1.xsd",
		'xmlns': "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
	}

	var obj = {
		'attr': invoiceAttr,
		'cbc:UBLVersionID': '2.1',
		'cbc:CustomizationID': 'TR1.2'
	}
	Object.keys(jsObject).forEach((key) => {
		if(Object.keys(obj).indexOf(key) < 0) {
			obj[key] = jsObject[key]
		}
	})
	var xmlString = js2xmlparser.parse(rootName, obj, options)
	xmlString = xmlString.replace('</cbc:ID>', '</cbc:ID><cbc:CopyIndicator>false</cbc:CopyIndicator>')
	xmlString = xmlString.replaceAll('<cbc:TaxExemptionReason/>', '')
	xmlString = xmlString.replaceAll('<cbc:TaxExemptionReasonCode/>', '')
	xmlString = xmlString.replaceAll('<cbc:IssueDate/>', '')
	// xmlString=xmlString.replaceAll('<cbc:ID/>','')
	return xmlString
}


exports.e_invoiceXslt = function(jsObject) {

	var xsltString = ''

	if(jsObject.additionalDocumentReference != undefined) {
		jsObject.additionalDocumentReference.forEach((e, index) => {
			if((e.documentType.value || '').toLowerCase() == 'xslt')
				if(e.attachment.embeddedDocumentBinaryObject.value != '') {
					xsltString = e.attachment.embeddedDocumentBinaryObject.value
				}

		})
	}


	return xsltString
}

exports.eInvoiceRenameKeys = (key) => {

	switch (key) {
		case 'uuid':
			return 'UUID'
		case 'id':
			return 'ID'
		case 'uri':
			return 'URI'
			//case 'attr': return '@'
	}
	if(key.length < 2) return key
	key = key[0].toUpperCase() + key.substr(1, key.length - 1)
	if(key.substr(key.length - 2, 2) == 'Id' && key.length > 2) {
		key = key.substr(0, key.length - 2) + 'ID'
	}
	return key
}

function einvoiceXmlHazirla(obj) {
	if(Array.isArray(obj)) {
		var newObj = []
		for(var i = 0; i < obj.length; i++) {
			newObj.push(einvoiceXmlHazirla(obj[i]))
		}
		return newObj
	} else if(typeof obj === 'object') {
		var newObj = {}


		var keys = Object.keys(obj)

		keys.forEach((key) => {
			if(key != 'attr' && key != 'value') {
				var key2 = key
				if((Array.isArray(obj[key]) || typeof obj[key] === 'object')) {
					key2 = 'cac:' + exports.eInvoiceRenameKeys(key)
					if(typeof obj[key] === 'object') {
						if(Object.keys(obj[key]).indexOf('value') > -1) {
							key2 = 'cbc:' + exports.eInvoiceRenameKeys(key)
						}
					}
					newObj[key2] = einvoiceXmlHazirla(obj[key])
				} else {
					key2 = 'cbc:' + exports.eInvoiceRenameKeys(key)
					newObj[key2] = obj[key]
				}
			} else {
				newObj[key] = obj[key]
			}

		})


		return newObj
	} else {
		return obj
	}
}

exports.eDocumentSetCurrencyIDs = function(obj, currencyID) {
	//if(obj==null) return obj
	if(typeof obj == 'function') return obj


	if(Array.isArray(obj)) {
		//var newObj=[]
		for(var i = 0; i < obj.length; i++) {
			//newObj.push(exports.eDocumentSetCurrencyIDs(obj[i],currencyID))
			obj[i] = exports.eDocumentSetCurrencyIDs(obj[i], currencyID)
		}
		return obj
	} else if(typeof obj === 'object') {
		//var newObj={}


		var keys = Object.keys(obj)

		keys.forEach((key) => {
			// if(obj[key]!=null && typeof obj[key]!='function' && typeof obj[key]!='ObjectID' && key.indexOf('$')<0  && key.indexOf('_')<0){
			if(key != 'attr' && key != 'value' && key != '_id' && key != '__v') { //&& key.indexOf('$')<0  && key.indexOf('_')<0
				if((Array.isArray(obj[key]) || typeof obj[key] === 'object')) {

					obj[key] = exports.eDocumentSetCurrencyIDs(obj[key], currencyID)
				}
				// else if(typeof obj[key]=='function'){

				//     obj[key]=obj[key]
				// }
			} else {
				//if(typeof obj[key]!='function'){
				if(key == 'attr') {

					if(obj[key]['currencyID'] != undefined) {
						if(obj[key]['currencyID'] == '') {

							obj[key]['currencyID'] = currencyID

						}
					}
				}

				// }else{
				//     eventLog('function:',key)
				// }
				//newObj[key]=obj[key]
			}
			// }

		})


		return obj
	} else {
		return obj
	}
}

var edespatchXmlHazirla = (obj) => einvoiceXmlHazirla(obj)

exports.e_despatch2xml = function(doc, rootName = 'DespatchAdvice') {

	try {


		var jsObject = JSON.parse(JSON.stringify(doc))

		jsObject = exports.deleteObjectFields(jsObject, ["_id", "createdDate", "modifiedDate", "deleted", "__v", "eIntegrator", 'ioType', 'despatchErrors', 'despatchStatus', 'localStatus', 'localErrors', 'pdf', 'html', 'despatchXslt', 'despatchXsltFiles'])
		jsObject = exports.deleteObjectProperty(jsObject, '_id')


		if(jsObject.despatchLine != undefined) {

			jsObject.despatchLine.forEach((line) => {
				if(line.taxTotal != undefined) {
					if(line.taxTotal.taxAmount != undefined) {
						if(line.taxTotal.taxAmount.value == 0 && line.taxTotal.taxSubtotal == undefined) {
							line.taxTotal = undefined
							delete line.taxTotal

						}
					}
				}
				if(line.item)
					if(line.item.originCountry)
						if(line.item.originCountry.identificationCode)
							if((line.item.originCountry.identificationCode.value || '') == '') {
								line.item.originCountry = undefined
								delete line.item.originCountry
								eventLog('calisti delete line.item.originCountry;')
							}
			})
		}

		jsObject = edespatchXmlHazirla(jsObject)

		var options = {
			attributeString: 'attr',
			valueString: 'value',
			declaration: {
				include: false,
				encoding: 'UTF-8',
				version: '1.0'
			},
			format: {
				doubleQuotes: true
			}
		}

		var despatchAttr = {
			'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
			'xmlns:qdt': 'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2',
			'xmlns:cctc': 'urn:un:unece:uncefact:documentation:2',
			'xmlns:ubltr': 'urn:oasis:names:specification:ubl:schema:xsd:TurkishCustomizationExtensionComponents',
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xmlns:udt': 'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2',
			'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
			'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
			'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
			'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
			'xmlns:xades': 'http://uri.etsi.org/01903/v1.3.2#',
			'xsi:schemaLocation': 'urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2 UBL-DespatchAdvice-2.1.xsd',
			'xmlns:q1': 'urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2'
		}

		var obj = {
			'attr': despatchAttr,
			'cbc:UBLVersionID': '2.1',
			'cbc:CustomizationID': 'TR1.2'
		}
		Object.keys(jsObject).forEach((key) => {
			if(Object.keys(obj).indexOf(key) < 0) {
				obj[key] = jsObject[key]
			}
		})
		var xmlString = js2xmlparser.parse(rootName, obj, options)
		xmlString = xmlString.replace('</cbc:ID>', '</cbc:ID><cbc:CopyIndicator>false</cbc:CopyIndicator>')
		xmlString = xmlString.replaceAll('<cbc:TaxExemptionReason/>', '')
		xmlString = xmlString.replaceAll('<cbc:TaxExemptionReasonCode/>', '')
		xmlString = xmlString.replaceAll('<cbc:IssueDate/>', '')
		xmlString = xmlString.replaceAll('[object Object]', '')
		// xmlString=xmlString.replaceAll('<cbc:ID/>','')
		return xmlString
	} catch (tryErr) {
		console.error('e_despatch2xml.tryErr', tryErr)
	}
}

exports.amountValueFixed2Digit = function(obj, parentKeyName) {
	if(typeof(obj) === 'undefined' || obj === null) return obj
	if(Array.isArray(obj)) {
		for(var i = 0; i < obj.length; i++) {
			obj[i] = exports.amountValueFixed2Digit(obj[i], parentKeyName)
		}
		return obj
	} else if(typeof obj == 'object') {
		var keys = Object.keys(obj)

		keys.forEach((key) => {
			if(typeof(obj) !== 'undefined' && obj !== null) {
				if(Array.isArray(obj[key]) || typeof obj[key] == 'object') {
					obj[key] = exports.amountValueFixed2Digit(obj[key], key)
				} else {
					if(parentKeyName.toLowerCase().indexOf('amount') > -1) {
						if(key == 'value') {
							if(!isNaN(obj[key])) {
								obj[key] = Number(obj[key]).toFixed(2)
							}

						}
					}
				}
			}
		})
		return obj
	} else {
		return obj
	}
}

exports.execCmd = function(executeCommand, params, cb) {
	const cp = require('child_process')
	// const child = cp.spawn(exec, [fileName, '-e'])
	const child = cp.spawn(executeCommand, params)

	let buf = ''
	let stderr = ''

	child.stdout.on('data', (c) => {
		buf += c
	})

	child.stderr.on('data', (data) => {
		stderr += data.toString('UTF-8')
		// cb({name:'child_process Error', message:data.toString('UTF-8')},'',data.toString('UTF-8'))
	})

	child.stdout.on('end', () => {

		cb(null, buf.toString('UTF-8'), stderr)
	})
}

exports.incString = function(text) {
	if(!text) return '1'
	var sbuf = ''
	for(var i = text.length - 1; i >= 0; i--) {
		if(!isNaN(text[i])) {
			sbuf = text[i] + sbuf
		} else {
			break
		}
	}
	if(sbuf == '') return text + '1'

	//A04950;  sbuf='04950'
	var numara = Number(sbuf)
	var numaraString = ''
	numara++
	if(numara.toString().length < sbuf.length) {
		numaraString = numara.toString()
		for(var i = 0; i < (sbuf.length - numara.toString().length); i++) {
			numaraString = '0' + numaraString
		}
	} else {
		numaraString = numara.toString()
	}
	if(numaraString.length >= text.length) {
		return numaraString
	} else {
		return text.substr(0, (text.length - numaraString.length)) + numaraString
	}
}



global.runNodeJs = (fileName, cb) => {
	const cp = require('child_process')
	const child = cp.spawn('node', [fileName, '-e'])

	let buf = ''
	child.stdout.on('data', (c) => {
		buf += c
	})

	child.stderr.on('data', (data) => {
		console.error('runNodeJs:', fileName)
		console.error('Hata:', data.toString('UTF-8'))
		if(cb) {
			return cb({ name: 'ERR_runNodeJs', message: data.toString('UTF-8') })
		}
	})

	child.stdout.on('end', () => {
		if(cb) {
			return cb(null, buf.toString('UTF-8'))
		}
	})
}

global.clone = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}

global.iteration = function(dizi, fonksiyon, interval, errContinue, callback) {
	var index = 0
	var result = []
	var errors = ''

	function tekrar(cb) {
		if(index >= dizi.length)
			return cb(null)
		// if(config.status=='development' && index>=3){
		// 	return cb(null)
		// }

		fonksiyon(dizi[index], (err, data) => {
			if(!err) {
				if(data)
					result.push(data)
				index++
				setTimeout(tekrar, interval, cb)
			} else {
				errorLog(`iteration():`, err)
				if(errContinue) {
					errors += `iteration(): ${err.message}\n`
					index++
					setTimeout(tekrar, interval, cb)
				} else {
					cb(err)
				}

			}
		})
	}

	tekrar((err) => {
		if(!err) {
			if(errContinue && errors != '') {
				if(callback)
					callback({ code: 'IterationError', message: errors }, result)
			} else {
				if(callback)
					callback(null, result)
			}
		} else {
			if(callback) {
				callback(err, result)
			}
		}

	})
}


exports.renameKey = (key) => {
	switch (key) {
		case 'UUID':
			return 'uuid'
		case 'ID':
			return 'ID'
		case 'URI':
			return 'URI'
		case '$':
			return 'attr'
	}
	if(key.length < 2) return key
	key = key[0].toLowerCase() + key.substr(1, key.length - 1)
	if(key.substr(key.length - 2, 2) == 'ID' && key.length > 2) {
		key = key.substr(0, key.length - 2) + 'Id'
	}
	return key
}

exports.renameInvoiceObjects = (obj, renameFunction) => {

	if(Array.isArray(obj)) {
		var newObj = []
		for(var i = 0; i < obj.length; i++) {
			newObj.push(exports.renameInvoiceObjects(obj[i], renameFunction))
		}
		return newObj
	} else if(typeof obj === 'object') {
		var newObj = {}

		var keys = Object.keys(obj)
		keys.forEach((key) => {
			var newKey = renameFunction(key)
			if((Array.isArray(obj[key]) || typeof obj === 'object') && (key != '$')) {
				newObj[newKey] = exports.renameInvoiceObjects(obj[key], renameFunction)
			} else {
				newObj[newKey] = obj[key]
			}
		})
		return newObj
	} else {
		return obj
	}
}

global.tempLog = (fileName, text) => {
	if(config.status != 'release')
		return
	var tmpDir = os.tmpdir()
	if(config) {
		if(config.tmpDir) {
			tmpDir = config.tmpDir
		}
	}
	fs.writeFileSync(path.join(tmpDir, fileName), text, 'utf8')
}

global.moduleLoader = (folder, suffix, expression, cb) => {

	try {
		var moduleHolder = {}
		var files = fs.readdirSync(folder)

		files.forEach((e) => {
			let f = path.join(folder, e)
			if(!fs.statSync(f).isDirectory()) {
				var fileName = path.basename(f)
				var apiName = fileName.substr(0, fileName.length - suffix.length)
				if(apiName != '' && (apiName + suffix) == fileName) {

					// if(protectedFields[apiName]==undefined){
					//     protectedFields[apiName]=protectedFields.standart
					// }
					moduleHolder[apiName] = require(f)
					if(expression != '')
						eventLog(`${expression} ${apiName.cyan} loaded.`)
				}
			}
		})

		cb(null, moduleHolder)
	} catch (e) {
		errorLog(
			`moduleLoader Error:
		         folder:${folder} 
		         suffix:${suffix}
		         expression:${expression}
		         `)
		cb(e)
	}
}

global.sendFileId = (dbModel, fileId, req, res, next) => {
	if(fileId) {
		dbModel.files.findOne({ _id: fileId }, (err, doc) => {
			if(dberr(err, next)) {
				if(dbnull(doc, next)) {
					sendFile(doc, req, res, next)
				}
			}
		})
	} else {
		next({ code: 'WRONG_ID', message: 'fileId bos' })
	}
}

global.sendFile = (file, req, res, next) => {
	var tmpFile = path.join(os.tmpdir(), `${uuid.v4()}.api`)
	try {
		if(file.data) {
			var fileName = file.fileName || 'file'
			var data = file.data
			if(file.data.indexOf('data:') == 0 && file.data.indexOf('base64,') > -1) {
				data = b64DecodeUnicode(file.data.split('base64,')[1])
			} else {
				data = file.data
			}

			fs.writeFileSync(tmpFile, data, 'utf8')

			res.sendFile(tmpFile, {}, (err) => {
				fs.unlinkSync(tmpFile)
				if(err)
					next(err)
			})


		} else {
			next({ code: 'FILE_EMPTY', message: 'Dosya icerigi bos' })
		}

	} catch (tryErr) {
		if(fs.existsSync(tmpFile)) {
			fs.unlinkSync(tmpFile)
		}
		next(tryErr)
	}

}


global.downloadFileId = (dbModel, fileId, req, res, next) => {
	if(fileId) {
		dbModel.files.findOne({ _id: fileId }, (err, doc) => {
			if(dberr(err, next)) {
				if(dbnull(doc, next)) {
					downloadFile(doc, req, res, next)
				}
			}
		})
	} else {
		next({ code: 'WRONG_ID', message: 'fileId bos' })
	}
}

global.downloadFile = (file, req, res, next) => {
	var tmpFile = path.join(os.tmpdir(), `${uuid.v4()}.api`)
	try {
		if(file.data) {
			var fileName = file.fileName || 'file'
			var data = file.data
			if(file.data.indexOf('data:') == 0 && file.data.indexOf('base64,') > -1) {
				data = b64DecodeUnicode(file.data.split('base64,')[1])
			} else {
				data = file.data
			}

			fs.writeFileSync(tmpFile, data, 'utf8')

			res.download(tmpFile, fileName, (err) => {
				fs.unlinkSync(tmpFile)
				if(err)
					next(err)
			})


		} else {
			next({ code: 'FILE_EMPTY', message: 'Dosya icerigi bos' })
		}

	} catch (tryErr) {
		if(fs.existsSync(tmpFile)) {
			fs.unlinkSync(tmpFile)
		}
		next(tryErr)
	}

}

global.b64EncodeUnicode = (str) => {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1)
		}))
}

global.b64DecodeUnicode = (str) => {
	return decodeURIComponent(atob(str).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}


global.encodeURIComponent2 = (str) => {
	return encodeURIComponent(str).replace(/[!'()*]/g, escape)
}

global.atob2 = (str) => {
	try {
		return b64DecodeUnicode(str)
	} catch (e) {
		return str
	}
}

global.btoa2 = (str) => {
	try {
		return b64EncodeUnicode(str)
	} catch (e) {
		return str
	}
}

exports.renderFiles = (files, data, cb) => {

	try {
		if(typeof data == 'string') {
			data = atob2(data)
			try {
				data = JSON.parse(data)
			} catch (err1) {

			}
		} else {
			if(data.files != undefined) {
				data.files.forEach((e) => {
					e.data = atob2(e.data)
				})
			}
		}


		// var renderedCode=''
		var includeCode = ''
		var code = ''
		files.forEach((e) => {
			if(e.fileName == 'index.ejs') {
				code = atob2(e.data)
				return
			}
		})


		code = code.replaceAll('include(', 'includeLocal(')
		code = code.replaceAll('encodeURIComponent(', 'encodeURIComponent2(')

		includeCode += `\n<% \nfunction includeLocal(fileName){ \n`
		includeCode += ` switch(fileName){  \n`
		files.forEach((e) => {
			if(e.fileName != 'index.ejs') {
				includeCode += ` case '${e.fileName}' : \n`
				if(e.fileName.substr(-4) == '.ejs') {
					includeCode += ` case '${e.fileName.substr(0,e.fileName.length-4)}' :
							%>
							${atob2(e.data)}`
				} else {
					includeCode += `%>
							${atob2(e.data)}`
				}
				includeCode += `<% break \r\n`
			}
		})
		includeCode += ` default: %>

				<% break
			}
		} %>`


		code = includeCode + code



		var renderedCode = ejs.render(code, { data: data })

		cb(null, renderedCode)


	} catch (tryErr2) {
		console.log(`tryErr2:`, tryErr2)
		errorLog(tryErr2)

		cb({ code: tryErr2.name || 'EJS_RENDER_ERROR', name: tryErr2.name || 'EJS_RENDER_ERROR', message: tryErr2.message || tryErr2.toString() })
	}

}

// global.ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
//     s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

global.fixJSON = (text) => {
	try {
		if(text == null)
			return {}

		if(typeof text == 'object')
			return text
		text = text.replaceAll('\r', '')
		var dizi = text.split('\n')
		var s = ''
		dizi.forEach((e) => {
			if(e.trim().substr(0, 2) != '//') {
				s += e + '\r\n'
			}
		})
		return JSON.parse(s)
	} catch (err) {
		return {}
	}


}


global.listObjectToObject = function(listObj) {
	if(typeof listObj != 'object' || listObj == null)
		return listObj
	var obj = {}

	Object.keys(listObj).forEach((mainKey) => {
		if(mainKey.indexOf('.') > -1) {
			var keys = mainKey.split('.')

			if(obj[keys[0]] == undefined)
				obj[keys[0]] = {}


			if(obj[keys[0]][keys[1]] == undefined) {
				if(keys.length == 2)
					return obj[keys[0]][keys[1]] = listObj[`${keys[0]}.${keys[1]}`]
				else
					obj[keys[0]][keys[1]] = {}
			}

			if(obj[keys[0]][keys[1]][keys[2]] == undefined) {
				if(keys.length == 3)
					return obj[keys[0]][keys[1]][keys[2]] = listObj[`${keys[0]}.${keys[1]}.${keys[2]}`]
				else
					obj[keys[0]][keys[1]][keys[2]] = {}
			}

			if(obj[keys[0]][keys[1]][keys[2]][keys[3]] == undefined) {
				if(keys.length == 4)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]] = listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]] = {}
			}

			if(obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] == undefined) {
				if(keys.length == 5)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}.${keys[4]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = {}
			}

			if(obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]] == undefined) {
				if(keys.length == 6)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]] = listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}.${keys[4]}.${keys[5]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]] = {}
			}
			if(obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]] == undefined) {
				if(keys.length == 7)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]] = listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}.${keys[4]}.${keys[5]}.${keys[6]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]] = {}
			}
			if(obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]][keys[7]] == undefined) {
				if(keys.length == 8)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]][keys[7]] = listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}.${keys[4]}.${keys[5]}.${keys[6]}.${keys[7]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]][keys[5]][keys[6]][keys[7]] = {}
			}

		} else {
			obj[mainKey] = listObj[mainKey]
		}
	})
	return obj
}

global.objectToListObject = function(obj) {
	var listObj = {}
	Object.keys(obj).forEach((key) => {
		if(typeof obj[key] == 'object') {
			Object.keys(obj[key]).forEach((key2) => {
				if(typeof obj[key][key2] == 'object') {
					Object.keys(obj[key][key2]).forEach((key3) => {
						if(typeof obj[key][key2][key3] == 'object') {
							Object.keys(obj[key][key2][key3]).forEach((key4) => {
								if(typeof obj[key][key2][key3][key4] == 'object') {
									Object.keys(obj[key][key2][key3][key4]).forEach((key5) => {
										if(typeof obj[key][key2][key3][key4][key5] == 'object') {
											Object.keys(obj[key][key2][key3][key4][key5]).forEach((key6) => {
												if(typeof obj[key][key2][key3][key4][key5] == 'object') {
													Object.keys(obj[key][key2][key3][key4][key5][key6]).forEach((key7) => {
														listObj[`${key}.${key2}.${key3}.${key4}.${key5}.${key6}.${key7}`] = obj[key][key2][key3][key4][key5][key6][key7]
													})
												} else {
													listObj[`${key}.${key2}.${key3}.${key4}.${key5}.${key6}`] = obj[key][key2][key3][key4][key5][key6]
												}

											})
										} else {
											listObj[`${key}.${key2}.${key3}.${key4}.${key5}`] = obj[key][key2][key3][key4][key5]
										}

									})
								} else {
									listObj[`${key}.${key2}.${key3}.${key4}`] = obj[key][key2][key3][key4]
								}
							})
						} else {
							listObj[`${key}.${key2}.${key3}`] = obj[key][key2][key3]
						}
					})
				} else {
					listObj[`${key}.${key2}`] = obj[key][key2]
				}
			})
		} else {
			listObj[key] = obj[key]
		}

	})
	return listObj
}


var crypto = require('crypto'),
	algorithm = 'aes-256-cbc',
	password = 'metinalifeyyaz',
	key = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase()

exports.encrypt = function(text) {
	var iv = Buffer.alloc(16)
	var cipher = crypto.createCipheriv(algorithm, key, iv)

	var crypted = cipher.update(text.toString(), 'utf8', 'hex')
	crypted += cipher.final('hex')
	return crypted
}

exports.decrypt = function(text) {
	var iv = Buffer.alloc(16)
	var decipher = crypto.createDecipheriv(algorithm, key, iv)

	var dec = decipher.update(text.toString(), 'hex', 'utf8')
	dec += decipher.final('utf8')
	return dec

}

exports.encryptbuffer = function(buffer) {
	var iv = Buffer.alloc(16)
	var cipher = crypto.createCipheriv(algorithm, key, iv)

	var crypted = Buffer.concat([cipher.update(buffer), cipher.final()])
	return crypted
}

exports.decryptBuffer = function(buffer) {
	var iv = Buffer.alloc(16)
	var decipher = crypto.createDecipheriv(algorithm, key, iv)
	var dec = Buffer.concat([decipher.update(buffer), decipher.final()])
	return dec
}

exports.reqPackage = function(connectinfo, command, params, requestid) {
	requestid = requestid || uuid.v4()
	return JSON.stringify({ connectinfo: connectinfo, type: 'REQUEST', requestid: requestid, command: command || '', params: params || '' })
}

exports.resPackage = function(connectinfo, command, data, requestid) {
	requestid = requestid || uuid.v4()
	return JSON.stringify({ connectinfo: connectinfo, type: 'RESPONSE', requestid: requestid, command: command || '', data: data || '' })
}



exports.socketwrite = function(socket, data, callback) {
	socket.write(exports.encrypt(data) + '\0', callback)
}

exports.socketread = function(data) {
	return exports.decrypt(data.toString('utf-8'))
}



exports.getParameters = function(callback) {
	var dbHelper = require('./dbhelper_mysql.js')
	var sql = "SELECT * FROM `parameters` WHERE 1=1 "

	dbHelper.query(sql, null, function(result) {
		if(!result.success) {
			callback(null)
		} else {
			var parameters = {}
			result.data.rows.forEach((e) => {
				parameters[e.ParamName] = e.ParamValue
			})

			callback(parameters)
		}
	})
}



String.prototype.padding = function(n, c) {
	var val = this.valueOf()
	if(Math.abs(n) <= val.length) {
		return val
	}
	var m = Math.max((Math.abs(n) - this.length) || 0, 0)
	var pad = Array(m + 1).join(String(c || ' ').charAt(0))
	return (n < 0) ? pad + val : val + pad
}




global.t = (new Date()).getTime()

global.time = (text = 't') => {
	var fark = (((new Date()).getTime()) - t) / 1000
	console.log(`${text}:`, fark)

}

global.timeReset = () => {
	t = (new Date()).getTime()
}


global.changeImageObject = (source) => {
	let target = {}
	Object.keys(source || {}).forEach((key) => {
		let key2 = key
		if(['small', 'medium', 'large'].includes(key)) {
			key2 = 'data'
		}
		target[key2] = source[key]
	})
	return target
}


var assetFileCacheList = []
global.assetVersion = (sourceFileName) => {
	var bFound = false
	var fileName = ''
	assetFileCacheList.forEach((e) => {
		if(e.fileName == sourceFileName) {
			bFound = true;
			fileName = e.fileName + '?v=' + e.version
			return
		}
	})

	if(bFound)
		return fileName

	var dosyaVarMi = false;
	var dosyaTamAdi = path.join(__root, 'assets', sourceFileName);
	try {
		if(fs.existsSync(dosyaTamAdi))
			dosyaVarMi = true
	} catch (err) {}
	if(dosyaVarMi == false)
		return sourceFileName

	var stats = fs.statSync(dosyaTamAdi);
	var obj = { fileName: sourceFileName, version: (new Date(stats.mtime)).yyyymmddhhmmss().replaceAll('-', '').replaceAll(' ', '').replaceAll(':', '') }

	assetFileCacheList.push(obj);
	return obj.fileName + '?v=' + obj.version;
}

global.fileVersion = (fullFileName) => {
	if(!fs.existsSync(fullFileName))
		return '00000000000000'
	let stats = fs.statSync(fullFileName);

	return (new Date(stats.mtime)).yyyymmddhhmmss().replaceAll('-', '').replaceAll(' ', '').replaceAll(':', '')
}


global.loadJSONFile=(fileName)=>{
	let s=fs.readFileSync(fileName,'utf8')
	// s=s.replaceAll('\t','\\t').replaceAll('\r','\\r').replaceAll('\n','\\n')
	let TAB ='  '
	s=s.replace(/\t/g, TAB)
	return JSON.parse(s)
}


global.getBaseURI = function(req) {
	let burasi = req.headers['x-forwarded-host'] || req.headers['x-forwarded-server'] || req.headers['host'] || ''
	burasi += req.originalUrl || req.url || ''
	return burasi
}

global.getBaseURIHost = function(req) {
	let burasi = req.headers['x-forwarded-host'] || req.headers['x-forwarded-server'] || req.headers['host'] || ''
	return burasi
}
global.getBaseURIUrl = function(req) {
	return req.originalUrl || req.url || ''
}