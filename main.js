var http = require('http'); 
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js')

var app = http.createServer(function(request, response){
    var _url = request.url;
    var querydata = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
        if(pathname ==='/'){    
            if(querydata.id === undefined){
                fs.readdir('./data', 'utf8', function(err, filelist){
                    var title = 'Welcome!!!';
                    var description = 'Hello Nodejs!!!!!';
                    var list = template.List(filelist);
                    var html = template.Html(list, title, 
                        `<a href = '/create'>Create<a>`, 
                        `<h2>${title}</h2> ${description}`);
                    response.writeHead(200);
                    response.end(html);
                })
            } else {
                fs.readFile(`data/${querydata.id}`, 'utf8', function(err, description){
                fs.readdir('./data', 'utf8', function(err, filelist){
                    var title = querydata.id;
                    var list = template.List(filelist);
                    var html = template.Html(list, title,
                        `<a href = '/create'>Create<a>
                        <a href = '/update?id=${title}'>Update</a> 
                        <form action ='delete_process' method = 'post'> 
                            <input type="hidden" name ='id' value= ${title}>
                            <input type="submit" value = "delete">
                        </form>`,
                        `<h2>${title}</h2> ${description}`);
                    response.writeHead(200);
                    response.end(html);
                })
                })
            };    
        } else if(pathname === '/create'){
            fs.readdir('./data', 'utf8', function(err, filelist){
                var title = 'WEB - Create';
                var list = template.List(filelist);
                var html = template.Html(list, title, `<a>Create<a>`, `
                    <form action = "/create_process" method = 'post'>
                        <p>
                            <input type = 'text' name = 'title' placeholder = 'title'>
                        </p>
                        <p>
                            <textarea name = 'description' placeholder = 'description'></textarea>
                        </p>
                            <input type = "submit" value = 'create'>
                    </form>
                `);  
            response.writeHead(200);
            response.end(html);
            });
        } else if(pathname === '/create_process'){
            var body = '';
            request.on('data', function(data){
                body += data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var title = post.title;
                var description = post.description;
                fs.writeFile(`data/${title}`, `${description}`, function(err){
                    response.writeHead(302, {'Location': `/?id=${title}`});
                    response.end();
                })
            });
        } else if(pathname === '/update'){
            fs.readFile(`data/${querydata.id}`, 'utf8', function(err, description){
                fs.readdir('./data', 'utf8', function(err, filelist){
                    var title = querydata.id;
                    var list = template.List(filelist);
                    var html = template.Html(list, title, `<a>Update ${title}</a>`, `
                        <form action = "/update_process" method = 'post'>
                                <input type = 'hidden' name ='id' value =${title}>
                            <p>
                                <input type = 'text' name = 'title' placeholder = 'title' value = ${title}>
                            </p>
                            <p>
                                <textarea name = 'description' placeholder = 'description'>${description}</textarea>
                            </p>
                                <input type = "submit" value = 'update'>
                        </form>
                         `);  
                    response.writeHead(200);
                    response.end(html);
                })
            })

        } else if(pathname === '/update_process'){
            var body = '';
            request.on('data', function(data){
                body += data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                var id = post.id;
                var title = post.title;
                var description = post.description;
                fs.rename(`data/${id}`, `data/${title}`, function(err){
                    fs.writeFile(`data/${title}`, description, function(err){
                        response.writeHead(302, {'Location': `/?id=${title}`});
                        response.end();
                    });      
                });
            });    
        } else if(pathname === '/delete_process'){
            var body = '';
            request.on('data', function(data){
                body += data;
            });
            request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(err){
                response.writeHead(302, {'Location': `/`});
                response.end()
              });
            });  
        } else {
            response.writeHead(404);
            response.end('Not Found');
        }
})
app.listen(3000);