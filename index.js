const cors = require('cors')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

const PORT = process.env.PORT

const genID = () =>{
    return Math.floor(Math.random() * 100000)
}

app.get('/api/persons', (req, res, next) =>{
    Person.find({})
    .then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) =>{
    Person.find({})
    .then(persons => {
        const info = "<div><p>The phonebook has info for " + persons.length + " people</p><p>" + Date() + "</p></div>"
        res.send(info)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) =>{
    Person.findById(req.params.id)
    .then(person => {
        res.json(person.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) =>{
    Person.findByIdAndRemove(req.params.id)
    .then(result =>{
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) =>{
    const body = req.body

    if(!body.name) {
        return res.status(400).json({ 
            error: "Request did not provide a name"
        })
    }
    if(!body.number) {
        return res.status(400).json({ 
            error: "Request did not provide a number"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
    .then(saved =>{
        res.json(saved.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) =>{
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updated => {
        res.json(updated.toJSON())
    })
    .catch(error => next(error))
})


const unknownEndpoint = (req, res) =>{
    res.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) =>{
    console.error(error.message)
    
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({error: 'malformatted id'})
    }
    
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})