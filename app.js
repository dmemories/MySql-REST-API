const express = require('express')
const bodyParser = require('body-parser')
const funcs = require('./functions.js')
const app = express()

// Database 
const mysql = require('mysql')
const tblName = "foods"
const sqlConn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'test',
})

// Middleware
app.use(bodyParser.json())

// Routing
app.get('/', (req, res) => {
    try {
        sqlConn.query(`SELECT * FROM \`${tblName}\``, (err, result, fields) => {
            if (err) throw err
            res.json({result:result})
        });
    }
    catch (err) { res.json({error:err}) }
})

app.post('/', (req, res) => {
    if (funcs.hasAllEle(req.body, ['name', 'price']) === false) {
        res.json({error:"Some data is invalid !"})
        return
    }
    try {
        let records = [
            [req.body.name, req.body.price]
            /*  ['Milk', 20],
            ['Salad', 50],
            ['Pizza', 100] */
        ]
        sqlConn.query(`INSERT INTO \`${tblName}\` (name, price) VALUES ?`, [records], (err, result, fields) => {
            if (err) throw err
            res.json({result:result})
        })
    }
    catch (err) { res.json({error:err}) }
})

app.put('/', (req, res) => {
    if (typeof req.body['id'] === 'undefined') {
        res.json({error:"Id is invalid !"})
        return
    }
    let nameEmpty = typeof req.body['name'] === 'undefined'
    let priceEmpty = typeof req.body['name'] === 'undefined'
    if (nameEmpty && priceEmpty) {
        res.json({error:"Have no request data !"})
        return
    }
    try {
        let queryStr, data
        if (nameEmpty) {
            queryStr = "price = ?"
            data = [req.body.price]
        }
        else if (priceEmpty) {
            queryStr = "name = ?"
            data = [req.body.name]
        }
        else  {
            queryStr = "name = ?, price = ?"
            data = [req.body.name, req.body.price]
        }
        sqlConn.query(`UPDATE \`${tblName}\` SET ${queryStr} WHERE id=${req.body['id']}`, data, (err, result, fields) => {
            if (err) throw err
            res.json({result:result})
        })
    }
    catch (err) { res.json({error:err}) }
})

app.delete('/', (req, res) => {
    if (typeof req.body['id'] === 'undefined') {
        res.json({error:"Id is invalid !"})
        return
    }
    try {
        sqlConn.query(`DELETE FROM \`${tblName}\` WHERE id=?`, req.body['id'], (err, result, fields) => {
            if (err) throw err
            res.json({result:`Number of rows deleted = ${result.affectedRows}`})
        })
    }
    catch (err) { res.json({error:err}) }
})

app.listen(3000, () => {
    console.log('Server is running...')
})