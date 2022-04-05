const express = require('express')
const app = express()
//Used Port is 8000
const PORT = 8000
const fs = require('fs')

//Viewing engine is pug with some addiotional ejs (HTML markup)
app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded( { 
    extended: true
}))

app.get('/', (req, res) => {
    fs.readFile('./data/todo.json', (err, data) => {
        //Throwing the error message if so
        if (err) throw err

        const todos = JSON.parse(data)

        res.render('home', {todos: todos})
    })
})

app.post('/add', (req, res) => {
    const formData = req.body

    if(formData.todo.trim() == '') {

        fs.readFile('./data/todo.json', (err, data) => {
            //Throwing the error message if so
            if (err) throw err

            const todos = JSON.parse(data)

            res.render('home', {error: true, todos: todos})
        })
    }
    else {
        fs.readFile('./data/todo.json', (err, data) => {
            //Throwing the error message if so
            if (err) throw err
            const todos = JSON.parse(data)
            //Building to JSON with block as
            //Id
            //Description or Text of TODO
            //Status Done True or False
            const todo = {
                id: id(),
                description: formData.todo,
                done: false 
            }
            //Adding it back
            todos.push(todo)

            fs.writeFile('./data/todo.json', JSON.stringify(todos), (err) => {
                //Throwing the error message if so
                if(err) throw err

                fs.readFile('./data/todo.json', (err, data) => {
                    //Throwing the error message if so
                    if (err) throw err

                    const todos = JSON.parse(data)

                    res.render('home', {success: true, todos: todos})
                })
            })
        })
    }
})

app.get('/:id/delete', (req, res) => {
    //Saving the ID value
    const id = req.params.id

    fs.readFile('./data/todo.json', (err, data) => {
        //Throwing the error message if so
        if (err) throw err

        const todos = JSON.parse(data)
        //filtering and finding all the values where id values' dont match the given values by the USER 
        const filteredTodos = todos.filter(todo => todo.id != id)

        fs.writeFile('./data/todo.json', JSON.stringify(filteredTodos), (err) => {
            //Throwing the error message if so
            if (err) throw err
            //Giving the rendered Home page where we no longer have Deleted TODO
            res.render('home', { todos: filteredTodos, delete: true})
        })
    })
})

app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/todo.json', (err, data) => {
        //Throwing the error message if so
        if (err) throw err
        // Indetify the TODO to change 
        const todos = JSON.parse(data)
        const todo = todos.filter(todo => todo.id == id)[0]

        //Getting it
        const todoIdx = todos.indexOf(todo)
        const splicedTodo = todos.splice(todoIdx, 1)[0]

        //Changing the status
        splicedTodo.done = true

        //Adding it back
        todos.push(splicedTodo)

        fs.writeFile('./data/todo.json', JSON.stringify(todos), (err) => {
            //Throwing the error message if so
            if (err) throw err

            res.render(`home`, { todos: todos })
        })
    })
    
})

app.listen(PORT, (err) => {
    //Throwing the error message if so
    if(err) throw err
    console.log(`Running on the port: ${PORT}`)
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };


///Login
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
  
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []
const userId = users.id

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
  
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
  
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
  
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } 
    catch {
      res.redirect('/register')
    }
    console.log(users)
    console.log(userId)

    fs.writeFile('./data/user.json', JSON.stringify(users), (err) => {
        //Throwing the error message if so
        if(err) throw err

        fs.readFile('./data/user.json', (err, data) => {
            //Throwing the error message if so
            if (err) throw err

            const users = JSON.parse(data)

            res.render('home', {success: true, users: users})
        })
    })
    console.log(users.id)
})
  
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
}
  
res.redirect('/login')
  }
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}
    

//Update
app.get('/update', (req, res) => {
    res.render('update.ejs')
})
//Cannot get the value of the TODO list id

//Priotization
//Checkbox items

//Date
var datetime = new Date();
console.log(datetime.toISOString().slice(0,10));
//The value used in the main pug (layout.pug) to display today's date
