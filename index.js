const express = require('express')
const fs = require('fs')
const Influx = require('influx')

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'digi',
    schema: [
      {
        measurement: 'temperatures',
        fields: {
          temp: Influx.FieldType.FLOAT
        },
        tags: [
          
        ]
      }
    ]
   })

port = 9876

const app = express()

app.use(express.json())

app.post('/weather', (req, res) => {
    insertData = req.body.randomdata
    influx.writePoints([
        {
          measurement: 'temperatures',
          fields: { temp: insertData },
          timestamp: Date.now()
        }
      ], {})
      .catch(error => {
        console.error(`Error saving data to InfluxDB! ${error.stack}`)
      })
    fs.appendFile('database.txt', req.body.randomdata + '\n', function (err, data) {
        if (err) throw err
        console.log('Saved!')
    })
    res.send(req.body)
})

app.get('/weather', (req, res) => {
    queryStamp = req.body.timestamp
    influx.query(`
    select * from temperatures
    where time = ${queryStamp}`)
  .then( result => res.status(200).json(result) )
  .catch( error => res.status(500).json({ error }) );
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})