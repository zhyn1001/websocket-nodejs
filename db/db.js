var MongoClient = require('mongodb').MongoClient
var dbName = 'runoob'
var url = 'mongodb://localhost:27017/'+dbName


module.exports = {
	connDB: function(callback){//链接数据库
		MongoClient.connect(url, {useNewUrlParser: true}, function(err, db){
			if(err) throw err
			callback(db)
		})
	},
	//查询
	find: function(collection, fStr={}, callback){
		this.connDB(function(db){
			var dbo = db.db(dbName)
			dbo.collection(collection).find(fStr).toArray(function(err, res){
				if(err) throw err
				console.log(res)
				db.close()
			})
		})
	},
	//更新
	update: function(collection, tj, newValue, isMulti=false, callback){
		this.connDB(function(db){
			var dbo = db.db(dbName)
			dbo.collection(collection).updateOne(tj, newValue, function(err, res){
				if(err) throw err;
				console.log('更新文档成功')
				db.close()
			},{isMulti:isMulti})
		})
	},
	//删除
	/**
	 * @param {Object} collection:数据库集合
	 * @param {Object} fStr:查询条件
	 * @param {Object} isMany:是否删除多条；1：是，0：否
	 * @param {Object} callback：回调函数
	 */
	dele:function(collection, fStr, isOne, callback){
		this.connDB(function(db){
			var dbo = db.db(dbName)
			
			if(isOne) {
				dbo.collection(collection).deleteMany(fStr, function(err, res){
					if(err) throw err
					console.log('删除成功')
					db.close()
				})
			}else{
				dbo.collection(collection).deleteOne(fStr, function(err, res){
					if(err) throw err
					console.log('删除成功')
					db.close()
				})
			}
		})
	},
	/**
	 * @param {Object} collection:集合
	 * @param {Object} document:插入文档
	 * @param {Object} callback:回调函数
	 */
	insert:function(collection, document, callback){
		this.connDB(function(db){
			var dbo = db.db(dbName)
			dbo.collection(collection).insertOne(document, function(err, res){
				if(err) throw err
				console.log('插入成功')
				db.close()
			})
		})
	}
}

/**
 * 	创建集合
	dbase.createCollection('site', function(err, res){
		if(err) throw err
		console.log('创建site集合')
		db.close()
	})
 */

/**
 * 插入一条数据
 * dbase.collection('site').insertOne(list, function(err, res){
		if(err) throw err
		console.log('插入文档成功')
		db.close()
	})
	
	插入多条
	insertMany()
	dbase.collection('site').insertMany(list, function(err, res){
			if(err) throw err
			console.log('插入文档成功')
			db.close()
		})
		
	查询所有
	dbase.collection('site').find({}).toArray(function(err, res){
		if(err) throw err
		console.log(res)
		db.close()
	})
	
	根据查询条件查询
	var findStr = {'name':'小红'}
	dbase.collection('site').find(findStr).toArray(function(err, res){
		if(err) throw err
		console.log(res)
		db.close()
	})
	
	更新
	var fStr = {code:'aaaa'}//查询条件
	var uStr = {$set:{name:'小立',url:'http://www.baidu.com'}}//更新项
	dbase.collection('site').updateOne(fStr, uStr, function(err, res){
		if(err) throw err;
		console.log('更新文档成功')
		db.close()
	})
	更新多文件
	updateMany()
	var fStr = {code:'aaaa'}//查询条件
	var uStr = {$set:{name:'小立',url:'http://www.baidu.com'}}//更新项
	dbase.collection('site').updateMany(fStr, uStr, function(err, res){
		if(err) throw err;
		console.log(res.result.nModified + ' 条文档更新成功')
		db.close()
	})
	
	删除单条
	var fStr = {code:'aaaa'}//查询条件
	dbase.collection('site').deleteOne(fStr, function(err, res){
		if(err) throw err
		console.log('删除成功')
		db.close()
	})
	
	删除多条
	var fStr = {code:'aaaa'}//查询条件
	dbase.collection('site').deleteMany(fStr, function(err, res){
		if(err) throw err
		console.log('删除成功')
		db.close()
	})
	
	排序（1为升序，-1为降序）
	var mysort = {code: 1}
	dbase.collection('site').find({}).sort(mysort).toArray(function(err, res){
		if(err) throw err
		console.log(res)
		db.close()
	})
 */