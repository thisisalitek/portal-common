var nodemailer=require('nodemailer')

exports.sendMail = function (mailto,subject, body,cb){
		let mailConfig=config.errorMail || config.mail || {}

		mailGonder(mailConfig,mailto,subject,body,cb)
}

exports.sendErrorMail=(subject,err,cb)=>{
	var body='Error:<br>'
	if(typeof err=='string'){
		body += err
	}else{
		body +='code:' + (err.code || err.name || '') + '<br>'
		body +='message:' + (err.message || '')
	}

	let mailConfig=config.errorMail || config.mail || {}
	console.log(`sendErrorMail() mailConfig :`,mailConfig)
	mailGonder(mailConfig,mailConfig.to || '',subject,body,cb)
}

function mailGonder(mailConfig,mailto,subject, body,cb){
	try {
		if(!util.isEmail(mailto)){
			if(cb){
				return cb({code:"EMAIL_NOT_VALID",message:"Email gecersiz."})
			}else{
				return
			}
		}
		var smtpTransport = require('nodemailer-smtp-transport')

		subject = subject.toPlainText().wordWrap(130)
		body = subject.body().wordWrap(130)

		var transporter = nodemailer.createTransport(smtpTransport({
			host: mailConfig.host || '',
			port: mailConfig.port || 587,
			secure:mailConfig.secure || false,
			auth: {
				user: (mailConfig.auth || {}).user || '',
				pass:(mailConfig.auth || {}).pass || ''
			},
			tls: { rejectUnauthorized: false }
		}))

		var mailOptions = {
			from: (mailConfig.auth || {}).user || '',
			to: mailto,  
			subject: subject + '',
			text: body + '',
			html: body + ''
		}

		transporter.sendMail(mailOptions, (error, info)=>{
			transporter.close()
			if(cb){
				if(error){
					cb(error)
				}else{
					cb(null,info.response)
				}
			}
		})
	} catch ( err ) {
		if(cb)
			cb(err)
	}
}