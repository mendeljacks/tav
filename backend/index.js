const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
var bcrypt = require('bcryptjs')
const cors = require('cors')
const app = express()
const secret_key = 'my_student_id'
const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'db'
})
app.use(cors())
app.use(express.json())

app.post('/signup', async (req, res) => {
    save_user(req.body.email, req.body.password)
        .then(el => res.status(201).json(el))
        .catch(err => res.status(400).json(err))
})

app.post('/login', async (req, res) => {
    login_user(req.body.email, req.body.password)
        .then(el => res.status(200).json(el))
        .catch(err => res.status(400).json(err))
})

const port = 5000
app.listen(port, () => console.log(`Server listening on localhost:${port}`))

const save_user = async (email, password) => {
    if (!email) { return Promise.reject('Must enter a email') }
    if (!password) { return Promise.reject('Must enter a password') }

    return pool.query(`INSERT INTO users (email,password) VALUES (${mysql.escape(email)}, ${mysql.escape(bcrypt.hashSync(password, 10))})`)
   
}

const get_users = async () => {
    const res = await pool.query('select * from users')
    return res[0]
}

const login_user = async (email, password) => {
    if (!email) { return Promise.reject('Must enter a email') }
    if (!password) { return Promise.reject('Must enter a password') }
    const users = await get_users()
    const user = users.filter(el => el.email === email)?.[0]
    if (!user) { return Promise.reject('Incorrect email') }
    if (!bcrypt.compareSync(password, user.password)) { return Promise.reject('Incorrect password') }

    const token = await new Promise((resolve, reject) => {
        jwt.sign({ email }, secret_key, /*{expiresIn: 60},*/(err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })

    return token
}