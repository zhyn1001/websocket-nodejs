window.onload = function(){
	var ws = null;
	let setName = document.querySelector(".set-name");
	let usersPanle = document.querySelector(".users-panle");
	let uList = document.querySelector(".u-list");
	var nickName = '';
	setName.onclick = function(){
		if(document.getElementById("nickName").value === "") {
			nickName = '匿名用户(小黑蛋儿)'
		} else {
			nickName = document.getElementById("nickName").value;
		}
		ws = new WebSocket("ws://127.0.0.1:12233")
		ws.onopen = function(){
			ws.send(strinfify({
				type:'setname',
				name:nickName
			}))
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
				}
			}
		}
	}
}

function strinfify(obj){
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