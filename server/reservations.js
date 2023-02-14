const router = require("express").Router();
const db = require("./db");

let secret = 'serverKeptSecret'
const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken

    jwt.verify(req.token, 'secret', (err, decoded) => {

      if (err) {
        if (err.expiredAt) {
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
  .route("/reservations")
  .get(async (req, res, next) => {
    let reservations = []
    try {
      const reservationsCollection = db.collection('reservations');
      const snapshot = await reservationsCollection.get();
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let reservation = {}
        reservation.id = doc.id
        reservation.airline = doc.data().flight.airline;
        reservation.flightNumber = doc.data().flight.flightNumber;
        reservation.origin = doc.data().flight.origin;
        reservation.destination = doc.data().flight.destination;
        reservation.price = doc.data().flight.price;
        reservation.date = doc.data().flight.date;
        reservation.flightLength = doc.data().flight.flightLength;
        reservation.numberOfTickets = doc.data().numberOfTickets;
        reservation.email = doc.data().user.email;
        reservation.firstName = doc.data().user.firstName;
        reservation.lastName = doc.data().user.lastName;
        reservation.phoneNumber = doc.data().user.phoneNumber;
        reservation.totalPrice = doc.data().totalPrice;
        reservation.user = doc.data().user;
        reservations.push(reservation)
      });
      res.status(200).send(reservations);

    } catch (err) {
      res.status(500).json(err);
      next(err);
    }
  })

  .post(verifyToken, async (req, res, next) => {
    try {
      const newReservation = {
        flight: {
          airline: req.body.airline,
          date: req.body.date,
          origin: {
            name: req.body.originAirport,
            city: req.body.originCity,
            country: req.body.originCountry,
          },
          destination: {
            name: req.body.destinationAirport,
            city: req.body.destinationCity,
            country: req.body.destinationCountry,
          },
          flightLength: req.body.flightLength,
          flightNumber: req.body.flightNumber,
          price: req.body.price
        },
        numberOfTickets: req.body.numberOfTickets,
        totalPrice: req.body.totalPrice,
        user: {
          userId: req.body.userId,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber
        }
      }

      console.log(newReservation)
      const addedReservation = await db.collection('reservations').add(newReservation);
      res.status(200).json(addedReservation);
    } catch (err) {
      res.status(500).json(err.message);
      next(err);
    }
  })

router
  .route("/reservations/:id")
  .get(async (req, res, next) => {
    try {
      const response = await db.collection("reservations").doc(req.params.id).get();
      let reservation = {};
      reservation.id = req.params.id;
      reservation.airline = response.data().flight.airline;
      reservation.flightNumber = response.data().flight.flightNumber;
      reservation.origin = response.data().flight.origin;
      reservation.destination = response.data().flight.destination;
      reservation.price = response.data().flight.price;
      reservation.date = response.data().flight.date;
      reservation.flightLength = response.data().flight.flightLength;
      reservation.numberOfTickets = response.data().numberOfTickets;
      reservation.email = response.data().user.email;
      reservation.firstName = response.data().user.firstName;
      reservation.lastName = response.data().user.lastName;
      reservation.phoneNumber = response.data().user.phoneNumber;
      reservation.totalPrice = response.data().totalPrice;
      res.status(200).json(reservation)
    } catch (err) {
      res.status(500).json(err);
      next(err);
    }

  })
  .put(verifyToken, async (req, res, next) => {
    try {
      console.log('Vreti sa modificati rezervarea cu id-ul: ' + req.params.id)
      const updatedReservation = await db.collection('reservations').doc(req.params.id).update(req.body)
      res.status(200).json({ updatedReservation })
    } catch (err) {
      res.status(500).json(err.message)
      next(err);
    }
  })
  .delete(verifyToken, async (req, res, next) => {
    try {
      console.log('Vreti sa stergeti rezervarea cu id-ul: ' + req.params.id)
      const res = await db.collection('reservations').doc(req.params.id).delete();
      res.status(200)
      res.json({ res })
    } catch (err) {
      console.log(err.message)
      res.status(500).json(err.message)
      next(err);
    }
  })

router
  .route("/reservationsCurrentUser/:userId")
  .get(async (req, res, next) => {
    let reservations = []

    try {

      const reservationsCollection = db.collection('reservations')
      const querySnapshot = await reservationsCollection
        .where("user.userId", "==", req.params.userId)
        .get()
      console.log('query:' + querySnapshot)

      querySnapshot.forEach(doc => {
        let reservation = {};
        reservation.id = doc.id
        reservation.airline = doc.data().flight.airline;
        reservation.flightNumber = doc.data().flight.flightNumber;
        reservation.origin = doc.data().flight.origin;
        reservation.destination = doc.data().flight.destination;
        reservation.price = doc.data().flight.price;
        reservation.date = doc.data().flight.date;
        reservation.flightLength = doc.data().flight.flightLength;
        reservation.numberOfTickets = doc.data().numberOfTickets;
        reservation.email = doc.data().user.email;
        reservation.firstName = doc.data().user.firstName;
        reservation.lastName = doc.data().user.lastName;
        reservation.phoneNumber = doc.data().user.phoneNumber;
        reservation.totalPrice = doc.data().totalPrice;
        reservation.user = doc.data().user;
        reservations.push(reservation)
      })

      console.log('reservations:' + reservations)
      res.status(200)
      res.json(reservations)
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
      next(err);
    }


  })


module.exports = router;