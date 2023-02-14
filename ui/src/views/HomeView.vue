<template>
  <NavigationUser v-if="isAuthenticated" />
  <Navigation v-if="!isAuthenticated" />
  <div class="home" :class="{ mobile }">
    <!-- <Navigation/> -->
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <el-header>
      <!-- <el-button type="danger" raised v-if="isAuthenticated" @click="logout">LOGOUT</el-button> -->
      <el-button type="warning" v-if="isAuthenticated && isAdmin" @click="generateFlights">Generate flight</el-button>
    </el-header>
    <el-main>
      <el-table :data="flights" :default-sort="{ prop: 'date', order: 'descending' }" stripe table-layout="auto"
        style="width: 100%">
        <el-table-column prop="date" label="Date" sortable width="160" />
        <el-table-column prop="airline" label="Airline" width="150" sortable />
        <el-table-column label="Origin">
          <el-table-column prop="origin.name" label="Airport" width="200" sortable />
          <el-table-column prop="origin.city" label="City" width="150" sortable />
          <el-table-column prop="origin.country" label="Country" width="150" sortable />
        </el-table-column>
        <el-table-column label="Destination">
          <el-table-column prop="destination.name" label="Airport" width="200" sortable />
          <el-table-column prop="destination.city" label="City" width="150" sortable />
          <el-table-column prop="destination.country" label="Country" width="150" sortable />
        </el-table-column>
        <el-table-column prop="flightLength" sortable label="Length (hours)" width="150" />
        <el-table-column prop="flightNumber" label="Number" width="130" sortable />
        <el-table-column prop="price" sortable label="Price ($)" width="130" />
        <el-table-column label="Operations" v-if="isAuthenticated" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" v-if="isAuthenticated && !isAdmin"
              @click="handleBuy(scope.$index, scope.row)">Buy</el-button>
            <el-button type="primary" v-if="isAuthenticated && isAdmin"
              @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button type="danger" v-if="isAuthenticated && isAdmin"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="this.flights.length" @current-change="setPage">
      </el-pagination>
    </el-main>
    <!-- <div v-for="i in flights" :key="i">
      <Flight :flight="i" />
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import Flight from '@/components/Flight.vue'
import { base_url, requestOptions } from '@/utils/requestOptions';
import { randFlightDetails, randFloat } from '@ngneat/falso';
import NavigationUser from "@/components/NavigationUser";
import Navigation from "@/components/Navigation";

import { ElNotification } from 'element-plus'

// import { ref } from 'vue';
// const componentKey = ref(0);

// const forceRerender = () => {
//   componentKey.value += 1;
// };

// function getRandomFloat(min, max, decimals) {
//   const str = (Math.random() * (max - min) + min).toFixed(decimals);

//   return parseFloat(str);
// }

export default {
  name: 'HomeView',
  data() {
    return {
      flights: [],
      componentKey: 0,
      mobile: window.innerWidth <= 700,
      page: 1,
      pageSize: 10,
      isSignedIn: this.$store.state.isAuthenticated
    }
  },
  components: {
    NavigationUser,
    Navigation
  },
  beforeCreate() {
    this.isSignedIn = this.$store.state.isAuthenticated
    console.log('issignedin: ' + this.isSignedIn)
  },
  created() {
    fetch(base_url, requestOptions)
      .then((res) => {
        if (res.status === 200) {
          res.json().then((res) => {
            this.flights = res
          })
        }

        else console.log('a aparut o eroare')
      }),
      addEventListener('resize', () => {
        this.mobile = innerWidth <= 700
      })
  },
  computed: {
    isAuthenticated() {
      if (localStorage.getItem("token") == "" || !localStorage.hasOwnProperty("token")) {
        console.log("false")
        return false;
      } else if (localStorage.getItem("token") != "" && localStorage.hasOwnProperty("token")) {
        console.log("true")
        return true;
      }
      //return this.$store.state.isAuthenticated;
    },
    isAdmin() {
      if (localStorage.getItem("isAdmin") == "true") {
        return true;
      } else if (localStorage.getItem("isAdmin") == "false") {
        return false;
      }
      //return this.$store.state.isAdmin;
    },
    flights() {
      return this.flights.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)
    }
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    setPage(val) {
      this.page = val
    },
    generateFlights() {
      //console.log('vrei sa trimiti flight: ', this.airline + ' / ' + this.origin.name + ' / ' + this.destination.name)
      let localRequestOptions = { ...requestOptions }
      localRequestOptions.method = "POST"
      let postData = { details: randFlightDetails(), price: randFloat({ min: 100, max: 3000, fraction: 2 }) };
      // let price = getRandomFloat(100, 200, 2)
      //console.log("....." + price)

      localRequestOptions.body = JSON.stringify(postData)
      //console.log(localRequestOptions.body)

      localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
      console.log(localRequestOptions.headers.Authorization)

      fetch(base_url + 'flights', localRequestOptions)
        .then((res) => {
          if (res.status === 200) {

            fetch(base_url, requestOptions)
              .then((res) => {
                if (res.status === 200) {
                  res.json().then((res) => {
                    this.flights = res
                  })
                }
              })
            ElNotification({
              title: 'Flight added',
              message: 'A random flight was successfully generated!',
              type: 'success',
            })
            //this.$router.go()
          }
          console.log(res)
        })

    },
    handleBuy(index, row) {
      console.log(index, row)
      console.log(this.flights)
      let currentFlight = this.flights.find(f => f.flightNumber == row.flightNumber && f.price == row.price)
      //let currentFlight = Array.prototype.find.call(this.flights, (x) => x.flightNumber == row.flightNumber)
      let currentFlightJ = JSON.stringify(currentFlight)
      let currentFlightP = JSON.parse(currentFlightJ)
      let currentFlightId = currentFlightP.id
      console.log('currentFlight: ' + currentFlightP);
      console.log('currentFlightId: ' + currentFlightId);
      this.$router.push({
        path: '/addReservation',
        query: {
          flightId: currentFlightP.id,
          date: row.date,
          airline: row.airline,
          flightNumber: row.flightNumber,
          flightLength: row.flightLength,
          originAirport: row.origin.name,
          originCity: row.origin.city,
          originCountry: row.origin.country,
          destinationAirport: row.destination.name,
          destinationCity: row.destination.city,
          destinationCountry: row.destination.country,
          price: row.price
        }
      });
      console.log(currentFlightP.id)
    },
    handleEdit(index, row) {
      let currentFlight = this.flights.find(f => f.flightNumber == row.flightNumber && f.price == row.price)
      //let currentFlight = Array.prototype.find.call(this.flights, (x) => x.flightNumber == row.flightNumber)
      let currentFlightJ = JSON.stringify(currentFlight)
      let currentFlightP = JSON.parse(currentFlightJ)
      let currentFlightId = currentFlightP.id
      console.log('currentFlight: ' + currentFlightP);
      console.log('currentFlightId: ' + currentFlightId);
      this.$router.push({
        path: '/editFlight',
        query: {
          flightId: currentFlightP.id,
          date: row.date,
          airline: row.airline,
          flightNumber: row.flightNumber,
          flightLength: row.flightLength,
          originAirport: row.origin.name,
          originCity: row.origin.city,
          originCountry: row.origin.country,
          destinationAirport: row.destination.name,
          destinationCity: row.destination.city,
          destinationCountry: row.destination.country,
          price: row.price
        }
      });
      console.log(currentFlightP.id)
    },
    handleDelete(index, row) {
      let currentFlight = this.flights.find(f => f.flightNumber == row.flightNumber && f.price == row.price)
      //let currentFlight = Array.prototype.find.call(this.flights, (x) => x.flightNumber == row.flightNumber)
      let currentFlightJ = JSON.stringify(currentFlight)
      let currentFlightP = JSON.parse(currentFlightJ)
      let currentFlightId = currentFlightP.id

      let localRequestOptions = { ...requestOptions }
      localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
      console.log(localRequestOptions.headers.Authorization)
      localRequestOptions.method = "DELETE"

      fetch(base_url + 'flights/' + currentFlightP.id, localRequestOptions)
        .then((res) => {
          if (res.status === 200) {
            fetch(base_url, requestOptions)
              .then((res) => {
                if (res.status === 200) {
                  res.json().then((res) => {
                    this.flights = res
                  })
                }
              })
            ElNotification({
              title: 'Flight deleted',
              message: 'The selected flight has been deleted from the database.',
              type: 'success',
            })
            //this.$router.go()
          }
          console.log(res)
        })

      //window.location.reload()
    },
    logout() {
      ElNotification({
        title: 'LOGOUT',
        message: 'You just logged out from your account!',
        type: 'info',
      })
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin")
      this.$store.state.isAdmin = "false"
      //window.location.reload()

      //this.forceRerender();
      //this.$router.push("/login");

      this.$router
        .push({ path: '/login' })
        .then(() => { this.$router.go() })
    }

  },
  handleCurrentChange(val) {
    this.page = val;
    console.log(this.page)
  }
}
</script>
