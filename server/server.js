var ws = require('nodejs-websocket')

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
				
				break;
			default:
				break;
		}
		// getAllChatter()
	})
}).listen(12233)

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