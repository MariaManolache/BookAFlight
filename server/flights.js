const randFloat = require('@ngneat/falso')
const randFlightDetails = require('@ngneat/falso')

const router = require("express").Router();
const db = require("./db");

let secret = 'serverKeptSecret'
const jwt = require('jsonwebtoken')
const moment = require('moment')

// function verifyToken(req,res,next){
//   let token=req.headers['authorization']
//   if(token){
//     console.log(token)
//       jwt.verify(token,'secret',(err,decoded)=>{
//           if(err){
//             console.log(err)
//               if(err.expiredAt){
//           console.log('Tokenul tau a expirat')
//                  res.status(403)
//                  res.send('expiredToken')
//               }
//               else{
//                   console.log('Tokenul tau nu este bun')
//                    res.status(403)
//                    res.send('brokenToken')
//               }

//           }
//           else{
//               console.log(decoded)
//               req.email=decoded.data
//             next()
//           }
//       })
//           }

// }

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken

    //console.log(req.token)
    jwt.verify(req.token, 'secret', (err, decoded) => {

      if (err) {
        if (err.expiredAt) {
          //if token expired, the err object will have an 'expiredAt' key
          res.json({ "message": 'Your token has expired. Please re-authenticate' });
        } else {
          res.json({ "message": 'You are NOT authorized to access this resource' })
        }
      } else {
        console.log(decoded.email)
        res.status(200).send({ message: 'Well kept secret' })
        next()
      }
    })
  } else {
    res.status(401).json({ message: 'No token found.' })
  }
}

router
  .route("/flights")
  .get(async (req, res, next) => {
    let flights = []
    try {
      const flightCollection = db.collection('flights');
      const snapshot = await flightCollection.get();
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let flight = {}
        flight.id = doc.id
        flight.airline = doc.data().airline;
        flight.flightNumber = doc.data().flightNumber;
        flight.origin = doc.data().origin;
        flight.destination = doc.data().destination;
        flight.price = doc.data().price;
        flight.date = doc.data().date;
        flight.flightLength = doc.data().flightLength;
        flights.push(flight)
      });
      res.status(200)
      res.json(flights);

    } catch (err) {
      res.status(500)
      res.json(err);
      next(err);
    }
  })

  .post(verifyToken, async (req, res, next) => {
    try {
      const newFlight = {
        airline: req.body.details.airline,
        date: moment(req.body.details.date).utc().format('YYYY-MM-DD HH:mm:ss'),
        destination: req.body.details.destination,
        origin: req.body.details.origin,
        flightLength: req.body.details.flightLength,
        flightNumber: req.body.details.flightNumber,
        price: req.body.price
      }
      console.log(newFlight)
      const addedFlight = await db.collection('flights').add(newFlight);
      res.status(200)
      res.json(addedFlight);
    } catch (err) {
      //console.log(err)
      res.status(500)
      res.json(err.message);
      next(err);
    }
  })

router
  .route("/flights/:id")
  .get(async (req, res, next) => {
    try {
      const response = await db.collection("flights").doc(req.params.id).get();
      let flight = {};
      flight.id = req.params.id;
      flight.airline = response.data().airline;
      flight.flightNumber = response.data().flightNumber;
      flight.origin = response.data().origin;
      flight.destination = response.data().destination;
      flight.price = response.data().price;
      flight.date = response.data().date;
      flight.flightLength = response.data().flightLength;
      res.status(200)
      res.json(flight)
    } catch (err) {
      //console.log(err)
      res.status(500)
      res.json(err);
      next(err);
    }

  })
  .put(verifyToken, async (req, res, next) => {
    try {
      console.log('Vreti sa modificati zborul cu id-ul: ' + req.params.id)
      const updatedFlight = await db.collection('flights').doc(req.params.id).update(req.body)
      res.status(200)
      res.json({ updatedFlight })
    } catch (err) {
      res.status(500)
      res.json(err.message)
      next(err);
    }
  })
  .delete(verifyToken, async (req, res, next) => {
    try {
      console.log('Vreti sa stergeti zborul cu id-ul: ' + req.params.id)
      const res = await db.collection('flights').doc(req.params.id).delete();
      res.status(200)
      res.json({ res })
    } catch (err) {
      res.status(500)
      console.log(err.message)
      res.json(err.message)
      next(err);
    }
  })

router
  .route("/generateFlights")
  .get(async (req, res) => {
    let flights = []
    try {
      let flight = {}
      flight.airline = randFlightDetails.airline;
      flight.flightNumber = randFlightDetails.flightNumber;
      flight.originAirport = randFlightDetails.origin;
      flight.destinationAirport = randFlightDetails.destination;
      flight.price = randFloat;
      //console.log("flightprice" + flight.price)
      flight.date = randFlightDetails.date;
      flight.flightLength = randFlightDetails.flightLength;

      const flightCollection = await db.collection('flights').add(flight);

      const snapshot = await flightCollection.get();
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let flight = {}
        flight.id = doc.id
        flight.airline = doc.data().details.airline;
        flight.flightNumber = doc.data().details.flightNumber;
        flight.originAirport = doc.data().details.originAirport;
        flight.destinationAirport = doc.data().details.destinationAirport;
        flight.price = doc.data().price;
        flight.date = doc.data().details.date;
        flight.flightLength = doc.data().details.flightLength;
        flights.push(flight)
      });
      res.status(200)
      res.json(flights);
    } catch (err) {
      res.status(500)
      console.log(err)
      res.json(err);
      next(err);
    }

  })

module.exports = router;
