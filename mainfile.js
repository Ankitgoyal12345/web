var express=require('express');
var bodyParser=require('body-parser');
var ejs=require('ejs');
var MongoClient=require('mongodb').MongoClient;
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended:false})



MongoClient.connect("mongodb://127.0.0.1/exam",function(err,db){
	if(!err){
		console.log("database connected");
		app.use(express.static('publicexam'));
		app.use(bodyParser.json());
		
		app.get('/index.html', function (req, res) {  
			res.sendFile( __dirname + "/" + "index.html" );    
			
		})
		
		app.get('/',function(req,res){
			
			console.log("got a get request from the homepage");
			res.send('<h1> Welcome to mongodb </h1>');	
		})
		
		
		app.get('/ins.html',function(req,res){
			
			res.sendFile( __dirname + "/" + "ins.html");
			
		})
		
	
		
		app.post('/process_post',function(req,res){
			console.log(req.body);
			res.setHeader('Content-Type','text/html');
			console.log("send data are POST: empid: "+req.body.empid+ " name: "+req.body.empname);
			
			var empid=req.body.empid;
			var empname=req.body.empname;
			
			db.collection('emp').insert({empid:empid,empname:empname});
			res.end("employee inserted--> "+JSON.stringify(req.body));
			
		});
		
		var server = app.listen(5000, function () {  
		var host = server.address().address  
		var port = server.address().port  
		console.log("Example app listening at http://%s:%s", host, port)  
		
		})
		
		
		
		
		app.get('/delete.html',function(req,res){
			
			res.sendFile(__dirname + "/" + "delete.html");
		})
		
		
		app.get('/delete',function(req,res){
			
			var empid=req.query.empid;
			db.collection('emp',function(err,data){
				data.remove({empid:empid},function(err,result){
					
					if(err){
						console.log("failed to remove data");
					}
					
					else{
						res.send(result);
						console.log("student information deleted");
					}
					
					
				});
				
				
			});
		});
		
		
		app.get('/search.html',function(req,res){
			res.sendFile(__dirname + "/" + "search.html");
			
			
		})
		
		app.get('/search',function(req,res){
			var empid=req.query.empid;
			db.collection('emp').find({empid:empid}).toArray(function(err,docs){
				
				if(err){
					console.log("failed to get data");
				}
				
				else{
					if(docs.length==0){
						res.send("NO DATA AVAILABLE");
					}
					
					else{
						res.status(200).json(docs);
					}
					
				}
				
				
				
			})
			
			
		})
		
		
		app.get('/update.html',function(req,res){
			res.sendFile(__dirname + "/" + "update.html");
		})
		
		app.get('/update',function(req,res){
			var empid1=req.query.empid;
			var empname1=req.query.empname;
			db.collection('emp',function(err,data){
				data.update({empid:empid1},{$set:{empname:empname1}},function(err,result){
					
					if(err){
						console.log("failed to update data");
					}
					
					else{
						res.send(result);
						console.log("employee updated");
					}
					
					
				})
				
			})
			
			
		})
		
		
		
		
		
		
	
	
		app.get('/display.html',function(req,res){
			res.sendFile(__dirname + "/" + "display.html");
		})
	
		app.get('/display',function(req,res){
				
			db.collection('emp').find().toArray(function(err,docs){
				
				if(err){
					console.log("failed to get data");
				}
				
				else{
					if(docs.length==0){
						res.send("NO DATA AVAILABLE");
					}
					
					else{
						res.status(200).json(docs);
					}
					
				}
				
				
				
			})
		
		})
	
	
	}
	
	else{
		db.close();
	}
	
});
