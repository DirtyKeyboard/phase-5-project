const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { fieldEncryptionMiddleware } = require('prisma-field-encryption')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cookieParser())
const prisma = new PrismaClient();
prisma.$use(fieldEncryptionMiddleware());
/*
    Set cookie: res.cookie(name, val, {maxAge: int}) //maxAge is optional
    Get cooke: req.cookies.COOKIENAME
*/

app.get('/ping', (req, res) => {
    res.status(200).send({ message: "pong"})
})

app.get('/check', (req, res) => {
    if (req.cookies.user)
        res.status(200).send({user: req.cookies.user})
    else
        res.status(401).send({message: "Not logged in."})
})

app.post('/login', async (req, res) => {
    try {
        const {password, email} = req.body
        const user = await prisma.user.findUnique({where: {email: email}})
        if (user.password === password) {
            res.cookie('user', user)
            res.status(200).send({message: "Logged in!", user: user})
        }
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.get('/logout', async (req, res) => {
    try {
        res.clearCookie('user')
        res.status(200).send({message: "Logged out"})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.post('/register', async (req, res) => {
    try {
        const user = await prisma.user.create({data: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        })
        res.cookie('user', user)
        res.status(201).send({ message: "successs!", user: user })
    }
    catch (err) {
        res.status(401).send({ message: err.message })
    }
})


app.listen(process.env.PORT, () => {
    console.log("Listening on port " + process.env.PORT)
})