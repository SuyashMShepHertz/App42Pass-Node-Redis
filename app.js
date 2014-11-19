
var redis = require('redis')
var request = require('request')
var cheerio = require('cheerio')

var client = redis.createClient(42461,"54.208.130.57", {auth_pass : "aobalvmyjd7afa8p5e7wpx1erlulsydw"})
//var client = redis.createClient();

var redisSaveLink = function(url, title, tags, callback){
	client.rpush('urls',JSON.stringify({url : url, title:title ,tags :tags}), function(err, result){
		callback(err);
	});
}

var app = {
	saveLink : function(url, tags, callback){
		request(url, function(error, response, body){
			if(response.statusCode  == 200){
				var $ = cheerio.load(body);
				var title = $('title').text();
				redisSaveLink(encodeURI(url), title, tags, callback);
			}
			else{
				callback(error);
			}
		});
	},
	
	getAllLinks : function(callback){
		client.lrange('urls', 0, -1, function(err, result){
			callback(result);
		});
	}
}

module.exports = app;