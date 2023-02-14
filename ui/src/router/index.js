import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddFlight from '../views/AddFlight.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import AddReservation from '../views/AddReservation.vue'
import Reservations from '../views/Reservations.vue'
import EditFlight from '../views/EditFlight.vue'
import EditReservation from '../views/EditReservation.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      name: 'AirTravel'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/addFlight',
    name: 'addFlight',
    component: AddFlight,
  },
  {
    path: '/addReservation',
    name: 'addReservation',
    component: AddReservation,
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations,
  },
  {
    path: '/editFlight',
    name: 'editFlight',
    component: EditFlight,
  },
  {
    path: '/editReservation',
    name: 'editReservation',
    component: EditReservation,
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  next()
})


export default router
