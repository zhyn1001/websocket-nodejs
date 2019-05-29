window.onload = function(){
	var ws = null;
	let setName = document.querySelector(".set-name");
	let usersPanle = document.querySelector(".users-panle");
	let uList = document.querySelector(".u-list");
	let uCount = document.querySelector('.u-counts')
	var nickName = '';
	setName.onclick = function(){
		var nick = document.getElementById("nickName")
		if(nick.value === "") {
			nickName = '匿名用户(小黑蛋儿)'
		} else {
			nickName = nick.value;
		}
		ws = new WebSocket("ws://127.0.0.1:12233")
		ws.onopen = function(){
			ws.send(stringify({
				type:'setname',
				name:nickName
			}))
		}
		var sendMsg = document.querySelector(".send")
		sendMsg.onclick = send
		
		ws.onmessage = function(e){
			var result = parse(e.data);
			if(result.type === 'serverUserInfo') {
				usersPanle.appendChild(createIntoDom(result))
			}
			if(result.type === 'userList') {
				uList.innerHTML = '';
				var res = parse(result.msg)
				res.forEach((list)=>{
					uList.appendChild(createUserList(list))
				})
				uCount.innerHTML = '('+ res.length +')'
			}
			if(result.type === 'serverMessage') {
				usersPanle.appendChild(createMsg(nickName, result))
			}
			if(usersPanle.scrollHeight>usersPanle.scrollTop) {
				usersPanle.scrollTop = usersPanle.scrollHeight
			}
		}
		
		nick.setAttribute('disabled', true)
		setName.setAttribute('disabled', true)
	}
	
	function send(){
		var value = document.getElementById("textVal").value
		if(value === '')return;
		ws.send(stringify({
			type:'chat',
			message:value
		}))
		document.getElementById("textVal").value = ''
	}
	
	function stringify(obj){
		return JSON.stringify(obj)
	}
	
	function parse(str){
		return JSON.parse(str)
	}
	
	function createIntoDom(result){
		var pNode = document.createElement('p');
		pNode.className = 'into-box'
		var spanNode = document.createElement('span');
		spanNode.innerHTML = result.msg
		spanNode.className = 'into-text'
		pNode.appendChild(spanNode)
		return pNode
	}
	
	function createUserList(result){
		var pNode = document.createElement('p');
		pNode.innerHTML = result.name;
		return pNode
	}
	/**
	 * <div class="text-panle-left">		divNode[0]
			<div class="head">		divNode[1]
				<img src="images/aa.jpg"/>
			</div>
			<div class="info">		divNode[2]
				<div class="info-time">2019-06-01 12:00:00</div>		divNode[3]
				<div class="info-text">今天的饭真好吃</div>		divNode[4]
			</div>
		</div>
	 */
	function createMsg(nickname, result){
		console.log(result)
		var divNode = []
		for(let i=0;i<5;i++){
			divNode.push(document.createElement('div'));	
		}
		if(nickname === result.name){
			divNode[0].className = 'text-panle-right'
		}else {
			divNode[0].className = 'text-panle-left'
		}
		divNode[1].className="head"
		divNode[0].appendChild(divNode[1])
		divNode[0].appendChild(divNode[2])
		var imgs = document.createElement('img');
		imgs.src = 'images/aa.jpg'
		divNode[1].appendChild(imgs)
		divNode[2].className = 'info'
		divNode[3].className = 'info-time'
		divNode[3].innerHTML = new Date().Format('yyyy-MM-dd hh:mm:ss')
		divNode[2].appendChild(divNode[3])
		divNode[4].className = 'info-text'
		divNode[4].innerHTML = '<pre>' + result.message + '</pre>'
		divNode[2].appendChild(divNode[4])
		
		return divNode[0]
	}
	
	Date.prototype.Format = function(fmt) { //author: meizz 
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +
				o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
}