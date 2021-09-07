const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
const port = 3000
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
const seedEvents = require('./seeds.js')

async function main(){
    await sequelize.sync();
    loadSeeds(seedEvents)
}
main()

const loadSeeds = async() => {
    await seedEvents.map(event => {
        Event.create({
            date: event.date, 
            title: event.title, 
            details: event.details
        })
    })
}

const jsonParser = bodyParser.json()
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
})

app.get('/events', jsonParser, (req, res) => {
    getEvents(res)
})
  
app.post('/events', jsonParser, (req, res) => {
    createEvent(req)
    getEvents(res)
})

app.put('/events/:id', jsonParser, (req, res) => {
    updateEvent(req)
    getEvents(res)
})

app.delete('/events/:id', jsonParser, (req, res) => {
    deleteEvent(req)
    getEvents(res)
})

async function createEvent(req){
    try {
        const newEvent = await Event.create({
            date: req.body.date, 
            title: req.body.title, 
            details: req.body.details
        })
        console.log(`created new event ${newEvent.title}`)
    } catch (error) {console.log(error)}
}

async function deleteEvent(req){
    try {
        await Event.destroy({
            where: {
              id: req.body.id
            }
        });
    } catch (error) {console.log(error)}
}

async function getEvents(res){
    let events = await Event.findAll();
    res.send(JSON.stringify({
        events : events,
    }))
}

async function updateEvent(req){
    try {
        const updatedEvent = await Event.update({
            date: req.body.date, 
            title: req.body.title, 
            details: req.body.details
        },{
            where: {id: req.body.id}
        }
        
        )
        console.log(`updated event ${updatedEvent.title}`)
    } catch (error) {console.log(error)}
}

const Event = sequelize.define('Event', {
    date: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    }
})





