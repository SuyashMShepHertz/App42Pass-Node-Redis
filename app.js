
var redis = require('redis')
var http = require('http')
var cheerio = require('cheerio')

var client = redis.createClient(47346,"54.213.93.154", {auth_pass : "a2kw4qg9oo3tlauf1bgckq89mw4i7huc"})
//var client = redis.createClient();

var redisSaveLink = function(url, title, tags, callback){
	/*client.incr('urlID', function(err, res){
		client.hmset('url:'+res, {url : url, title:title ,tags :tags}, function(err, result){
			callback(err);
		});
	});*/
	client.rpush('urls',JSON.stringify({url : url, title:title ,tags :tags}), function(err, result){
		callback(err);
	});
}

var app = {
	saveLink : function(url, tags, callback){
		//console.log("------------Saving URL : "+url);
		http.get(url, function(res){
			var result = "";
			res.on('data', function(chunk){
				result += chunk;
			});
			res.on('end', function(){
				var $ = cheerio.load(result);
				var title = $('title').text();
				redisSaveLink(encodeURI(url), title, tags, callback);
			});
		});
	},
	
	getAllLinks : function(callback){
		//console.log("------------Getting All URLs");
		client.lrange('urls', 0, -1, function(err, result){
			//console.log("Error : " + err != null? 'No error' : err);
			callback(result);
		});
	}
}

module.exports = app;