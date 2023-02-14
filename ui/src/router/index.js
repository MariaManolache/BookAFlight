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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Register,
    // meta: {
    //   disableIfLoggedIn: true,
    // }
    // component: function () {
    //   return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    // }
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Login,
    // component: function () {
    //   return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    // }
    // meta: {
    //   disableIfLoggedIn: true
    // }
    // meta: {
    //   layout: LayoutsName.EmptyLayout,
    // }
  },
  {
    path: '/addFlight',
    name: 'addFlight',
    component: AddFlight,
    // meta: {
    //   layout: LayoutsName.EmptyLayout,
    // }
  },
  {
    path: '/addReservation',
    name: 'addReservation',
    component: AddReservation,
    // meta: {
    //   layout: LayoutsName.EmptyLayout,
    // }
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations,
    // meta: {
    //   layout: LayoutsName.EmptyLayout,
    // }
  },
  {
    path: '/editFlight',
    name: 'editFlight',
    component: EditFlight,
    // meta: {
    //   layout: LayoutsName.EmptyLayout,
    // }
  },
  {
    path: '/editReservation',
    name: 'editReservation',
    component: EditReservation,
    // meta: {
    //   layout: LayoutsName.EmptyLayout,
    // }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.name === 'Register' || to.name === 'Login' || to.name === 'HomeView')
//     next()
//   else if (to.name !== 'Login' && !store.state.isAuthenticated) next({ name: 'Login' })
//   else next()
// })

// router.beforeEach((to, from, next) => {
//   // if (!to.meta.public) {
//     if (to.name === 'register' || to.name === 'login' || to.name === 'home')
//       next()
//     else if (to.name !== 'login' && !store.state.isAuthentif) next({ name: 'login' })
//     else next()
//   // }
//   // next();
// })

// router.beforeEach(async (to, from) => {
//   if (
//     // make sure the user is authenticated
//     !isAuthenticated &&
//     to.name !== 'login'
//   ) {
//     // redirect the user to the login page
//     return { name: 'login' }
//   }
// })

router.beforeEach((to, from, next) => {
  // if (to.name === 'register' || to.name === 'login' || to.name === 'home')
  next()
  // else if (to.name !== 'login' && !store.state.isAuthenticated) next({ name: 'login' })
  // else next()
})


export default router
