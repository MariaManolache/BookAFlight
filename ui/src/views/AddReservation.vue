<template>
    <NavigationUser />
    <div class="home" :class="{ mobile }">
        <el-form :model="form">
            <el-space direction="vertical" size="large">
                <el-card class="box-card">
                    <div>{{ this.flight.airline }}</div>
                    <div> {{ this.flight.originAirport }} ---> {{ this.flight.destinationAirport }}</div>
                    <div>Flight number: {{ this.flight.flightNumber }}</div>
                    <div>Length: {{ this.flight.flightLength }} hours | Price: {{ this.flight.price }} $</div>
                    <div>Date: {{ this.flight.date }}</div>
                </el-card>
                <p>Number of tickets:</p>
                <el-input-number v-model="numberOfTickets" :min="1" :max="10" :step="1" @change="handleChange" />
                <p>Total price:</p>
                <div>{{ Math.round(this.numberOfTickets * this.flight.price * 100 ) / 100}} $</div>
                <el-button type="primary" @click="addReservation">Add reservation</el-button>
            </el-space>
        </el-form>
    </div>
</template>


<script>
import { base_url, requestOptions } from '@/utils/requestOptions';
import { ElNotification } from 'element-plus'
import NavigationUser from '@/components/NavigationUser'

export default {
    name: 'Reservation',
    components: {
        NavigationUser
    },
    props: {
        reservation: {
            type: Object
        }
    },
    data() {
        return {
            flight: {
                flightId: this.$route.query.flightId,
                airline: this.$route.query.airline,
                originAirport: this.$route.query.originAirport,
                originCity: this.$route.query.originCity,
                originCountry: this.$route.query.originCountry,
                destinationAirport: this.$route.query.destinationAirport,
                destinationCity: this.$route.query.destinationCity,
                destinationCountry: this.$route.query.destinationCountry,
                flightLength: this.$route.query.flightLength,
                flightNumber: this.$route.query.flightNumber,
                date: this.$route.query.date,
                price: this.$route.query.price,
            },
            numberOfTickets: '',
            totalPrice: ''
        }
    },
    methods: {
        handleChange() {
            console.log(this.numberOfTickets)
        },
        addReservation() {
            let localRequestOptions = { ...requestOptions }
            localRequestOptions.method = "GET"

            fetch(base_url + 'users/' + localStorage.getItem("userId"))
                .then((res) => {
                    let totalPriceVar = Math.round(this.numberOfTickets * this.flight.price * 100) / 100
                    res.json().then((res) => {
                        let response = {
                            flightId: this.flight.flightId,
                            airline: this.flight.airline,
                            originAirport: this.flight.originAirport,
                            originCity: this.flight.originCity,
                            originCountry: this.flight.originCountry,
                            destinationAirport: this.flight.destinationAirport,
                            destinationCity: this.flight.destinationCity,
                            destinationCountry: this.flight.destinationCountry,
                            flightLength: this.flight.flightLength,
                            flightNumber: this.flight.flightNumber,
                            date: this.flight.date,
                            price: this.flight.price,
                            userId: localStorage.getItem("userId"),
                            email: res.email,
                            firstName: res.firstName,
                            lastName: res.lastName,
                            phoneNumber: res.phoneNumber,
                            numberOfTickets: this.numberOfTickets,
                            totalPrice: totalPriceVar
                        }
                        console.log(response)

                        let localRequestOptions = { ...requestOptions }
                        localRequestOptions.method = "POST"

                        localRequestOptions.body = JSON.stringify(response)

                        localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
                        console.log(localRequestOptions.headers.Authorization)

                        fetch(base_url + 'reservations', localRequestOptions)
                            .then((res) => {
                                if (res.status === 200) {
                                    ElNotification({
                                        title: 'New Reservation',
                                        message: 'The reservation was successfully added!',
                                        type: 'success',
                                    })

                                    this.$router
                                        .push({ path: '/' })
                                } else if (res.status === 500) {
                                    ElNotification({
                                        title: 'Failed Reservation',
                                        message: 'The reservation was not added!',
                                        type: 'error',
                                    })
                                }
                                console.log(res)
                            })
                    })
                })
        }
    }
}
</script>

<style>

</style>