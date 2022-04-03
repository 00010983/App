const express = require('express')
const app = express()
const PORT = 8000
const fs = require('fs')


app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded( { 
    extended: false
}))

app.get('/', (req, res) => {
    fs.readFile('./data/todo.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        res.render('home', {todos: todos})
    })
})

app.post('/add', (req, res) => {
    const formData = req.body

    if(formData.todo.trim() == '') {

        fs.readFile('./data/todo.json', (err, data) => {
            if (err) throw err

            const todos = JSON.parse(data)

            res.render('home', {error: true, todos: todos})
        })
    }
    else {
        fs.readFile('./data/todo.json', (err, data) => {
            if (err) throw err
            const todos = JSON.parse(data)

            const todo = {
                id: id(),
                description: formData.todo,
                done: false
            }

            todos.push(todo)

            fs.writeFile('./data/todo.json', JSON.stringify(todos), (err) => {
                if(err) throw err

                fs.readFile('./data/todo.json', (err, data) => {
                    if (err) throw err

                    const todos = JSON.parse(data)

                    res.render('home', {success: true, todos: todos})
                })
            })
        })
    }
})

app.listen(PORT, (err) => {
    if(err) throw err
    console.log(`Running ${PORT}`)
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };