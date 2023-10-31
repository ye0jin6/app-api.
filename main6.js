const express = require('express')
const app = express()
const fs = require('fs')
const template = require('./lib/template.js')
const port = 3000


app.post('/delete_process', (req,res) => {
    let body = ``
    req.on('data', (data)=>{
        body = body+data
    })
    req.on('end', () => {
        const post = qs.parse(body)
        const id = post.id
        fs.unlink(`page/${id}`, (err) =>{
            res.redirect(302,`/`)
        })
    })
})

app.get('/', (req, res) => {
    let {name} = req.query
    fs.readdir(`page`, (eff, files) => {
        let list = template.list(files)
        fs.readFile(`page/${name}`, 'utf-8', (err, data) => {
            let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>
            <form action="delete_process" method="post"> 
                <input type='hidden' name='id' value='${name}'>
                <button type='submit>Del</button>
            </form>
            `// create, update, delete ('/')
            if (name === undefined) {
                name = '명언'
                data = 'Education is a progressive discovery of our own ignorance.'
                control = `<a href="/create">create</a>`
            }
            const html = template.HTML(name, list, `<h2>${name}</h2><p>${data}</p>`, control)
            res.send(html);
        })
    })
})
app.get('/update', (req,res) =>{
    let {name} = req.query
    fs.readdir('page', (err,files) =>{
        let list = template.list(files)
        fs.readFile(`page/${name}`, 'utf8', (err, content) => {
            let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>
            <form action="delete_process" method="post"> 
                <input type='hidden' name='id' value='${name}'>
                <button type='submit>Del</button>
            </form>
            `
            const data = template.updata(name,content)
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control)
            res.send(html);
        })
    })
})


app.get('/create', (req,res) => {
    fs.readdir('page', (eff, files) => {
        const name = 'create'
        const list = template.list(files)
        const data = template.create()
        const html = template.HTML(name.list,data,'')
        res.send(html)
    })
}) 
const qs = require('querystring')
const { deserialize } = require('v8')
app.post('/create_process', (req,res)=>{
    body = ''
    req.on('data', (data)=>{
        body = body+data
    }) // if sended data is existing then it works
    req.on('data', ()=>{
        const post = qs.parse(body)
        const id = post.id
        const title = post.title
        const description = post.description
        fs.rename(`page/${id}`, `page/${title}`, (err)=>{
            fs.writeFile(`page/${title}`, description, 'utf-8', (err)=>{
                res.redirect(302,`/?name=${title}`)
            })
        }) 
    })
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})