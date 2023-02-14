<template>
    <NavigationUser />
    <!-- <component-to-re-render :key="componentKey" /> -->
        <el-main>
            <el-table :data="reservations" :default-sort="{ prop: 'date', order: 'descending' }" stripe
                table-layout="auto" style="width: 100%">
                <el-table-column prop="date" label="Date" sortable width="180" />
                <el-table-column prop="airline" label="Airline" width="130" sortable />
                <el-table-column label="Origin" sorted>
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
                <el-table-column prop="price" sortable label="Price per ticket($)" width="130" />
                <el-table-column prop="numberOfTickets" sortable label="Number of tickets" width="180" />
                <el-table-column prop="totalPrice" sortable label="Total price ($)" width="180" />
                <el-table-column label="Operations" v-if="isAuthenticated && !isAdmin" width="180" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" v-if="isAuthenticated && !isAdmin"
                            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button type="danger" v-if="isAuthenticated && !isAdmin"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-if="isAdmin" label="User">
                    <el-table-column prop="user.email" label="Email" width="200" sortable />
                    <el-table-column prop="user.firstName" label="First name" width="150" sortable />
                    <el-table-column prop="user.lastName" label="Last name" width="150" sortable />
                    <el-table-column prop="user.phoneNumber" label="Phone number" width="150" sortable />
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="this.reservations.length" @current-change="setPage">
            </el-pagination>
        </el-main>
</template>

<script>
// @ is an alias to /src
import Reservation from '@/components/Reservation.vue'
import { base_url, requestOptions } from '@/utils/requestOptions';
import { ElNotification } from 'element-plus'
import NavigationUser from '@/components/NavigationUser'

export default {
    name: 'Reservation',
    components: {
        NavigationUser
    },
    data() {
        return {
            reservations: [],
            page: 1,
            pageSize: 10
        }
    },
    created() {
        let localRequestOptions = { ...requestOptions }
        localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
        localRequestOptions.method = "GET"

        console.log("isAdmin: " + localStorage.getItem("isAdmin"))

        if (localStorage.getItem("isAdmin") == "true") {
            console.log(localStorage.getItem("isAdmin") == "true")
            fetch(base_url + 'reservations', localRequestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        res.json().then((res) => {
                            this.reservations = res
                        })
                    }
                })
        } else {
            fetch(base_url + 'reservationsCurrentUser/' + localStorage.getItem("userId"), localRequestOptions)

                .then((res) => {
                    //if (res.status === 200) {
                    res.json().then((res) => {
                        this.reservations = res
                    })
                    //}
                })

            // .then((res) => {
            //         //if (res.status === 200) {
            //         //let allReservations = []
            //         res.json().then((res) => {
            //             //allReservations = res
            //             res.forEach(element => {
            //                 // if (element.userId == localStorage.getItem('userId')) {
            //                 this.reservations.push(element)
            //                 //}
            //             });
            //             // allReservations.filter(function (reservation) {
            //             //     if (reservation.userId == localStorage.getItem('userId')) {
            //             //         return reservation;
            //             //     }
            //             // })
            //             // this.reservations = allReservations
            //             //this.reservations = res
            //         })
            //         // }

            //         //else console.log('a aparut o eroare')
            //     })
        }


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
        reservations() {
            return this.reservations.slice(
                this.pageSize * this.page - this.pageSize,
                this.pageSize * this.page
            );
        },
    },
    methods: {
        handleEdit(index, row) {
            let currentReservation = this.reservations.find(r => r.flightNumber == row.flightNumber && r.price == row.price
                && r.numberOfTickets == row.numberOfTickets)
            //let currentFlight = Array.prototype.find.call(this.flights, (x) => x.flightNumber == row.flightNumber)
            let currentReservationJ = JSON.stringify(currentReservation)
            let currentReservationP = JSON.parse(currentReservationJ)
            let currentReservationId = currentReservationP.id
            console.log('currentFlight: ' + currentReservationP);
            console.log('currentFlightId: ' + currentReservationId);
            this.$router.push({
                path: '/editReservation',
                query: {
                    reservationId: currentReservationP.id,
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
                    price: row.price,
                    numberOfTickets: row.numberOfTickets,
                    totalPrice: row.totalPrice
                }
            });
            console.log(currentReservationP.id)
        },
        handleDelete(index, row) {
            let currentReservation = this.reservations.find(r => r.flightNumber == row.flightNumber && r.price == row.price
                && r.numberOfTickets == row.numberOfTickets)
            //let currentFlight = Array.prototype.find.call(this.flights, (x) => x.flightNumber == row.flightNumber)
            let currentReservationJ = JSON.stringify(currentReservation)
            let currentReservationP = JSON.parse(currentReservationJ)
            let currentReservationId = currentReservationP.id

            let localRequestOptions = { ...requestOptions }
            localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
            console.log(localRequestOptions.headers.Authorization)
            localRequestOptions.method = "DELETE"

            fetch(base_url + 'reservations/' + currentReservationP.id, localRequestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        localRequestOptions.method = "GET"
                        fetch(base_url + 'reservationsCurrentUser/' + localStorage.getItem("userId"), localRequestOptions)

                            .then((res) => {
                                //if (res.status === 200) {
                                res.json().then((res) => {
                                    this.reservations = res
                                })
                                //}
                            })

                        ElNotification({
                            title: 'Deleted Reservation',
                            message: 'The selected reservation was deleted',
                            type: 'success',
                        })
                        //this.$router.go()
                    }
                    console.log(res)
                })



        },
        setPage(val) {
            this.page = val;
        }
    },
    handleCurrentChange(val) {
        this.page = val;
    }
}
</script>
