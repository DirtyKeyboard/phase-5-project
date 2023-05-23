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

app.get('/check', async(req, res) => {
    if (req.cookies.user)
        {
            const user = await prisma.user.findUnique({where: {id: req.cookies.user.id}, include: {plans: true}})
            res.status(200).send({user: user})
        }
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

app.patch('/update_user', async (req, res) => {
    try {
        for (key in req.body) {
            const user = await prisma.user.update({
                where: {
                    email: req.cookies.user.email
                },
                data: {
                    [key]: req.body[key]
                }
            })
            res.cookie('user', user)
        }
        res.status(200).send({message: "OK"})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
    
})

app.post('/search', async (req, res) => { //returns the first 10 found, page 0 is the first page, next page gets the next 10.
    try {
        const users = await prisma.user.findMany({where: {username: {contains: req.body.username, mode: 'insensitive'}}, take: 10, skip: (req.body.page*10)})
        res.status(200).send({users: users})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.get('/user/:username', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({where: {username: req.params.username}})
        res.status(200).send({user: user})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.get('/friends', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({where: {username: req.cookies.user.username}, include: {friends: true}})
        res.status(200).send({friends: user.friends})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.get('/outgoing_friend_requests', async(req, res) => {
    try {
        const user = await prisma.user.findUnique({where: {
            username: req.cookies.user.username
        },
        include: {
            friendRequestSent: {
                where: {
                    status: "WAITING"
                }
            }
        }})
        res.status(200).send({sent: user.friendRequestSent})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.get('/incoming_friend_requests', async(req,res) => {
    try {
        const user = await prisma.user.findUnique({where: {
            username: req.cookies.user.username
        },
        include: {
            friendRequestRecieved: {
                where: {
                    status: "WAITING"
                },
                include: {
                    from: true
                }
            }
        }})
        res.status(200).send({incoming: user.friendRequestRecieved})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.get('/incoming_friend_requests_from/:username', async(req,res) => {
    try {
        const user = await prisma.user.findUnique({where: {
            username: req.cookies.user.username
        },
        include: {
            friendRequestRecieved: {
                where: {
                    status: "WAITING",
                    from:{
                        username: req.params.username
                    }
                }
            }
        }})
        res.status(200).send({incoming: user.friendRequestRecieved})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.post('/send_friend_request', async(req, res) => {
    try {
        const fromUser = await prisma.user.findUnique({where: {username: req.cookies.user.username}})
        const toUser = await prisma.user.findUnique({ where: { username: req.body.username } })
        const request = await prisma.friendRequest.create({
            data: {
                from_id: fromUser.id,
                to_id: toUser.id
            },
            include: {
                from: true,
                to: true
            }
        })
        res.status(201).send({ request: request })
    }
    catch (err) {
        res.status(401).send({error: err.message})
    }
})

app.post('/force_add', async(req, res) => {
    try {
        const friend = await prisma.user.findUnique({where: {username: req.body.username}})
        const user = await prisma.user.update({
            where: {
                username: req.cookies.user.username
            },
            data: {
                friends: {
                    connect: {
                        id: friend.id
                    }
                }
            }
        })
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.post('/decline_request/:id', async(req, res) => {
    try {
        const request = await prisma.friendRequest.update({where: {id: parseInt(req.params.id)}, data: {status: "DECLINED"}})
    }
    catch (err)
    {
        res.status(401).send({message: err.message})
        console.log(err)
    }
})

app.post('/accept_request/:id', async(req, res) => {
    try {
        const requestId = parseInt(req.params.id)
        const liveRequest = await prisma.friendRequest.update(
            {
                where: {id: requestId
            },
            data:
            {
                status: "ACCEPTED"
            }})
        const user = await prisma.user.update({
            where: {
                username: req.cookies.user.username
            },
            data: {
                friends: {
                    connect: {
                        id: liveRequest.from_id
                    }
                }
            },
            include: {
                friends: true
            }
        })
        const friend = await prisma.user.update({
            where: {
                id: liveRequest.from_id
            },
            data: {
                friends: {
                    connect: {
                        id: liveRequest.to_id
                    }
                }
            },
            include: {
                friends: true
            }
        })
        res.status(201).send({request: liveRequest, user: user})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.post('/remove_friend', async(req, res) => {
    try {
        const friend = await prisma.user.update({where: {username: req.body.username}, data:{friends:{disconnect:{id: req.cookies.user.id}}}})
        const user = await prisma.user.update({
            where: {
                username: req.cookies.user.username
            },
            data: {
                friends: {
                    disconnect: {
                        id: friend.id
                    }
                }
            }
        })
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.post('/create_event', async(req, res) => {
    try {
        const newPlan = await prisma.entry.create({data: {
            name: req.body.name,
            time: req.body.time,
            userId: req.cookies.user.id
        }})
        res.status(200).send({plan: newPlan})
    }
    catch (err) {
        res.status(401).send({message: err.message})
        console.log(err)
    }
})

app.delete('/delete_event/:id', async(req,res) => {
    try {
        const id = parseInt(req.params.id)
        const ev = await prisma.entry.delete({where: {id: id}})
        res.status(200).send({message: 'deleted!', event: ev})
    }
    catch (err) {
        res.status(401).send({message: err.message})
        console.log(err)
    }
})

app.post('/create_entry_request', async (req, res) => {
    try {
        const entryRequest = await prisma.entryRequest.create({data: {
            name: req.body.name,
            time: req.body.time,
            reciever_user_id: req.body.recieverId,
            sent_user_id: req.cookies.user.id
        }})
        res.status(200).send({request: entryRequest})
    }
    catch (err) {
        console.log(err.message)
        res.status(401).send({message: err.message})
    }
})

app.get('/incoming_entry_request', async(req, res) => {
    try {
        const user = await prisma.user.findUnique({where: {id: req.cookies.user.id},
            include: {
                plan_request_recieved: {
                    where: {
                        status: "WAITING",
                    },
                    include: {
                        sent_by: true
                    }
                }
            }})
        res.status(200).send({entries: user.plan_request_recieved})
    }
    catch (er) {
        console.log(err.message)
        res.status(401).send({message: err.message})
    }
})

app.patch('/decline_request/:id', async(req, res) => {
    try {
        const requestToDecline = await prisma.entryRequest.update({
            where: {id: parseInt(req.params.id)},
            data: {status: 'DECLINED'}})
        res.status(200).send({message: 'Reject successfull'})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.patch('/accept_request/:id', async(req, res) => {
    try {
        const requestToAccept = await prisma.entryRequest.update({
            where: {id: parseInt(req.params.id)},
            data: {status: 'ACCEPTED'}})
        
        const myPlan = await prisma.entry.create({data: {
                name: requestToAccept.name,
                time: requestToAccept.time,
                userId: requestToAccept.reciever_user_id
            }})

        await prisma.entry.create({data: {
                name: requestToAccept.name,
                time: requestToAccept.time,
                userId: requestToAccept.sent_user_id
            }})
        res.status(200).send({message: 'Accept successfull', plan: myPlan})
    }
    catch (err) {
        res.status(401).send({message: err.message})
    }
})

app.listen(process.env.PORT, () => {
    console.log("Listening on port " + process.env.PORT)
})