var template = {
    Html : function templateHtml(list, title, control, body){
        return `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
            </body>
            </html>`
            },
    List : function templateList(filelist){
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
            i++
        }
        list = list + '</ul>';
        return list;
    }
    
}

module.exports = template;