const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.static('dist'));

app.use(express.json());
// app.use(morgan('tiny'));

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    `${JSON.stringify(req.body)}`,
  ].join(' ');
}));


const cors = require('cors');

app.use(cors());


let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];


app.get('/api/persons', (request, response) => {
  response.json(persons);
});


app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  const personId = Math.floor(Math.random() * 1000);

  if (!name || !number) {
    response.json({ error: 'name & number is required' });
    return;
  }

  const exits = persons.find((item) => item.name === name);

  if (exits) {
    response.json({ error: 'name must be unique' });
    return;
  }

  const obj = {
    id: personId,
    name,
    number,
  };

  persons.push(obj);

  response.status(200).send('Person added');
});


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((item) => item.id == id);

  if (!person) {
    response.status(400).end();
  }

  response.json(person);
});


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((item) => item.id != id);

  response.status(204).end();
});


app.get('/info', (request, response) => {
  response.send(`Phone book has info for 2 people<br><br>${Date()}`);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
