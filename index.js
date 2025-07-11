const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())
app.use(express.static('dist'))

app.get('/api/contacts', 
    (request, response) => {
        response.json(data)
    }
)

app.get('/contacts', 
    (request, response) => {
        response.send(`Phonebook has info for ${data.length} people <br/> ${new Date()}`)
    }
)

app.get('/api/contacts/:id',
    (request, response) => {
        const r = data.find(user => user.id===request.params.id)
        if(r){
            response.json(r)
        } else {
            response.status(404).end()
        }
    }
)

app.delete('/api/contacts/:id',
    (request, response) => {
        data.filter(user => user.id !== request.params.id)
        response.status(204).end()
    }
)


app.use(express.json())
morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/contacts/',
    (request, response) => {
        const body = request.body
        if(!body.name || !body.number) 
            return response.status(404).json({error: 'Content missing'})
        if(data.find(user => user.name === body.name)) 
            return response.status(404).json({error: 'name must be unique'})
        const obj = {
            name: body.name,
            number: body.number,
            id: Math.floor(Math.random() * 1_00_000)
        }
        data.push(obj)
        response.json(obj)
    }
)

const PORT = process.env.PORT || 3001
app.listen(PORT,
    () => {
        console.log(`server running on port ${PORT}`)
    }
)