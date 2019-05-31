var db = require('../db/db')
var ws = require('nodejs-websocket')
new Promise(function(resolve, reject){	
	resolve()
}).then(function(res){
	db.dele('site', {code:'wwww'}, 0)
	// db.insert('site', {code:'kill',name:'牛奶'})
}).then(function(res){
	db.find('site',{})
})
var server = ws.createServer(function(conn){
	conn.on('text', function(data){
		var result = JSON.parse(data)
		switch(result.type) {
			case 'setname':
				conn.nickname = result.name
				boardcast(JSON.stringify({
					type:'serverUserInfo',
					msg:result.name + ' 加入房间'
				}))
				boardcast(JSON.stringify({
					type:'userList',
					msg:getAllChatter()
				}))
				break;
			case 'chat':
				boardcast(JSON.stringify({
					type:'serverMessage',
					name:conn.nickname,
					message:result.message
				}))
				break;
			default:
				break;
		}
	})
	
	conn.on('close', function(){
		boardcast(JSON.stringify({
			type:'serverUserInfo',
			msg:conn.nickname + ' 离开房间'
		}))
		boardcast(JSON.stringify({
			type:'userList',
			msg:getAllChatter()
		}))
	})
	
	conn.on('error', function(err){
		console.log('异常关闭')
	})
}).listen(12233)
/**
 * 向所有用户广播
 * @param {Object} msg :广播信息
 */
function boardcast(msg){
	server.connections.forEach(function(conn){
		conn.sendText(msg)
	})
}
/**
 * 获取所有在线用户
 */
function getAllChatter(){
	var chatter = []
	
	server.connections.forEach(function(conn){
		chatter.push({
			name:conn.nickname
		})
	})
	
	return JSON.stringify(chatter)
}