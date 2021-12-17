exports.start= function (server, passportFunc) {
	if(!server)
		return
	socketCorsDomainList=['https://portal.tr216.com','http://portal.tr216.com','http://portal.ganygo.com','http://ganygo.com','http://www.ganygo.com']


	global.io = require("socket.io")(server, {
		cors: {
			origin:function(origin,callback){
				if(socketCorsDomainList.includes(origin) || origin.indexOf('http://localhost')>-1){
					callback(null,true)
				}else{
					callback(new Error('Hatali domain erisimi'))
				}
			}

		}
	})

	global.socketClients=[]

	io.on('connection', socket => {

		socket.id=uuid.v4()
		socketClients.push(socket)


		socket.on('message', (data) => {
			console.log('client message:',data)
		})

		socket.on('I_AM_HERE', (token,dbId) => {
			passportFunc(token,(err, member)=>{
				if(!err){
					socket.memberId=member._id
					socket.username=member.username
					socket.dbId=dbId
					exports.sendTotalUnread(socket)
				}else{
					errorLog(err)
				}
			})
		})
		socket.on('READ_ALL', () => {
			db.notifications.updateMany({memberId:socket.memberId,dbId:socket.dbId},{$set:{isRead:true,readDate:(new Date())}},{multi:true},(err,result)=>{
			})
		})

		socket.on('disconnect', () => {
			var foundIndex=0
			socketClients.findIndex((e,index)=>{
				if(e.id==socket.id){
					foundIndex=index
					return true
				}	
			})
			if(foundIndex>-1){
				console.log(`foundIndex:`,foundIndex)
				socketClients.splice(foundIndex,1)
			}
		})

		socket.on('REQUEST_CONSOLE', (cmd,params) => {
			console.log(`REQUEST_CONSOLE :`,cmd,params)
			exports.requestConsole(socket,cmd,params)
		})
	})
}

exports.notify=function(memberId,dbId,text,status,icon){
	var socket
	socketClients.forEach((e)=>{
		if(e.memberId==memberId && e.dbId==dbId){
			socket=e
		}
	})
	if(socket){
		socket.emit('NOTIFY',text,status,icon)
		exports.sendTotalUnread(socket)
	}
}


exports.sendTotalUnread=function(socket){
	var filter={memberId:socket.memberId,dbId:socket.dbId,isRead:false}
	
	db.notifications.find(filter).sort({_id:-1}).exec((err,docs)=>{
		if(!err){
			var totalUnread=docs.length
			var dizi=[]
			docs.forEach((e,index)=>{
				if(index<10){
					dizi.push(e)
				}
			})
			socket.emit('TOTAL_UNREAD',totalUnread,dizi)
		}
	})
}

var spawn = require('child_process').spawn
exports.requestConsole=function(socket,cmd,params=[]){
	try{
		if(!['ping','pm2'].includes(cmd)){
			return hacklemeyeCalisanaMesaj(socket,'RESPONSE_CONSOLE')
			
		}else if(cmd=='pm2'){
			if(params.length>0){
				if(params[0]!='logs'){
					return hacklemeyeCalisanaMesaj(socket,'RESPONSE_CONSOLE')
				}
			}
		}
		var proc = spawn(cmd, params)

		let buf = ''
		proc.stdout.on('data', (c) => {
			var line=c.toString()
			if(line.indexOf('\n')>-1){
				socket.emit('RESPONSE_CONSOLE',buf)
				buf=''
				var dizi=line.split('\n')
				dizi.forEach((e,index)=>{
					if(index<dizi.length-1){
						socket.emit('RESPONSE_CONSOLE',`${e}\n`)
					}
				})
				buf+=dizi[dizi.length-1]
			}else{
				buf+=c
			}

		})

		proc.stderr.on('data', (data) => {
			socket.emit('RESPONSE_CONSOLE','HATA:' + data.toString('UTF-8'))
		});

		proc.stdout.on('end', () => {
			socket.emit('RESPONSE_CONSOLE',buf)
		})
	}catch(tryErr){
		errorLog(tryErr)
	}
}

function hacklemeyeCalisanaMesaj(socket,command){
	var mesajlar=[
	'Quaeso, rerum curam magis utile!\n',
	'Please, take care of more useful things!\n',
	'Lutfen, daha faydali seylerle ilgilen!\n',
	'Lutfen, daha faydali seylerle ilgilen!\n',
	'Ugrasma boyle bos islerle\n'
	]

	var index=0
	function calistir(){
		if(index>=mesajlar.length)
			return

		socket.emit(command,mesajlar[index])
		index++
		setTimeout(calistir,4000)
	}
	

	calistir()
}