module.exports =(app,cb)=>{
	var http = require('http')
	var port = app.get('port')
	var server = http.createServer(app)

	server.listen(port)

	server.on('error', (err)=>{
		if (err.syscall !== 'listen') 
			throw err

		switch (err.code) {
			case 'EACCES':
			console.error(`Port: ${port} requires elevated privileges`)
			process.exit(1)
			if(cb)
				cb(err)
			break
			case 'EADDRINUSE':
			console.error(`Port: ${port}is already in use`)
			process.exit(1)
			if(cb)
				cb(err)
			break
			default:
			console.error(`http-server.js error:`,err)
			if(cb)
				cb(err)
			break
		}
	})

	server.on('listening', ()=>{
		if(cb)
			cb(null,server,port)
	})

}


