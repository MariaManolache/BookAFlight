const express = require('express');
const app = express();
const router = require("express").Router();
const port = 3000;
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const db = require("./db");

app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //we expect JSON data to be sent as payloads
app.use(cors())

const logger = require('morgan'); //importing a HTTP logger

app.use(logger('dev')); //using the HTTP logger library

var propertiesRouter = require('./flights');
app.use('/', propertiesRouter);

var propertiesRouterReservations = require('./reservations');
app.use('/', propertiesRouterReservations);

let secret = 'serverKeptSecret'

app.get('/', async (req, res, next) => {

  let flights = []
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

  res.status(200);
  res.json(flights);
});

app.get('/users', async (req, res, next) => {
  let users = []
  try {
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      let user = {}
      user.email = doc.data().email;
      user.firstName = doc.data().firstName;
      user.lastName = doc.data().lastName;
      user.password = doc.data().password;
      user.phoneNumber = doc.data().phoneNumber;
      users.push(user)
    });
    res.status(200).json(users);

  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
})

app.get('/users/:id', async (req, res, next) => {
  try {
    const userRef = await db.collection('users').doc(req.params.id).get();
    let user = {}
    user.id = req.params.id;
    user.lastName = userRef.data().lastName;
    user.firstName = userRef.data().firstName;
    user.email = userRef.data().email;
    user.phoneNumber = userRef.data().phoneNumber;
    console.log("user: " + user)
    res.json(user);

  } catch (err) {
    res.status(500).json(err);
    next(err);
  }

})

app.post('/register', async (req, res, next) => {
  let userToAdd = req.body

  const querySnapshot = await db
    .collection('users')
    .where("email", "==", userToAdd.email)
    .get()

  if (querySnapshot.empty) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(userToAdd.password, salt, function (err, hash) {
        userToAdd.password = hash
        db.collection("users").add(userToAdd)
      });
    });
    res.status(200).json({ message: "User added." })
  } else {
    res.status(500).json({ message: "User already exists in the database." })
    next(err);
  }

})

app.post("/login", async (req, res) => {
  let loginData = req.body

  const querySnapshot = await db
    .collection('users')
    .where("email", "==", loginData.email)
    .get()

  if (querySnapshot.empty) {
    res.status(404).json({ message: "User not found!" });
  } else {
    querySnapshot.forEach(doc => {
      bcrypt.compare(loginData.password, doc.data().password, async function (err, result) {
        if (result) {
          console.log(loginData.email)
          let token = jwt.sign({
            data: loginData.email
          }, 'secret', { expiresIn: '1h' })

          if (loginData.email == "admin@gmail.com") {
            console.log(token)
            res.status(200).send({ "token": token, "doc": doc.id , "isAdmin": true})
            console.log(doc.id)
          } else {
            console.log(token)
            res.status(200).send({ "token": token, "doc": doc.id})
            console.log(doc.id)
          }


        }
        else res.status(403).json({ message: "Password is wrong! Try again." });
      });
    })
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});