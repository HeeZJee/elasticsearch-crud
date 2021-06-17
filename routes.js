const express = require('express');
const router = express.Router()

const { Client } = require('@elastic/elasticsearch');
const e = require('express');
const { query } = require('express');

const bodyParser = require('body-parser').json();

const employees = [
    {
        "name": "sonoo",
        "salary": 56000,
        "married": true
    },
]

const elasticClient = new Client({
    node: 'http://es-srv-01.digitrends.pk/',
})



router.use((req, res, next) => {
    const { query, body, url, method, headers, params } = req;
    const { statusCode, statusMessage } = res;
    const logBody = { query, body, url, method, headers, statusCode, statusMessage, params }

    elasticClient.index({
        index: "test-logs",
        body: logBody
    })
        .then(log => console.log({ message: 'Success', log }))
        .catch(err => console.log({ message: 'Error', err }))
    next()
})

router.post('/employee', bodyParser, (req, res) => {
    const query = {
        index: 'test-employee',
        body: req.body
    }

    elasticClient.index(query)
        .then(r => res.send({ message: 'Employee Indexed', response: r }))
        .catch(err => res.send({ message: 'Error', err }))

})

router.get('/employee/:id', (req, res) => {
    const query = {
        index: 'test-employee',
        id: req.params.id
    }

    elasticClient.get(query)
        .then(r => res.send({ employee: r.body }))
        .catch(err => res.send({ message: 'Error', err }))

})

router.put('/employee/:id',bodyParser, (req, res) => {
    const query = {
        index: 'test-employee',
        id: req.params.id,
        body: {
            doc: req.body
        }
    }

    elasticClient.update(query)
        .then(r => res.send({ message: 'Employee Updated', employee: r }))
        .catch(err => res.send({ message: 'Error', err }))

})

router.delete('/employee/:id', (req, res) => {
    const query = {
        index: 'test-employee',
        id: req.params.id,

    }

    elasticClient.delete(query)
        .then(r => res.send({ message: 'Employee Deleted', employee: r.body }))
        .catch(err => res.send({ message: 'Error', err }))

})

router.get('/employees', (req, res) => {
    const query = {
        index: 'test-employee'
    }

    if (req.query.employee) query.q = `*${req.query.employee}*`
    elasticClient.search(query)
        .then(r =>
            res.send({
                data: { employees: r.body.hits }
            }))
        .catch(err => res.send({ message: 'Error', err }))

})


elasticClient.info(console.log)


module.exports = router