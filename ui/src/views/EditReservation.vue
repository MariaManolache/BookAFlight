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
            <div>{{ Math.round(this.numberOfTickets * this.flight.price * 100) / 100 }} $</div>
            <el-button type="primary" @click="editReservation">Edit reservation</el-button>
        </el-space>
    </el-form>
    </div>
</template>


<script>
import { base_url, requestOptions } from '@/utils/requestOptions';
import { ElNotification } from 'element-plus'
import NavigationUser from '@/components/NavigationUser'

export default {
    name: 'EditReservation',
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
            numberOfTickets: this.$route.query.numberOfTickets
        }
    },
    methods: {
        editReservation() {
            let totalPriceVar = this.flight.price * this.numberOfTickets
            let putData = {
                flight: {
                    airline: this.flight.airline,
                    origin: {
                        name: this.flight.originAirport,
                        city: this.flight.originCity,
                        country: this.flight.originCountry
                    },
                    destination: {
                        name: this.flight.destinationAirport,
                        city: this.flight.destinationCity,
                        country: this.flight.destinationCountry
                    },
                    flightLength: this.flight.flightLength,
                    flightNumber: this.flight.flightNumber,
                    date: this.flight.date,
                    price: this.flight.price
                },
                numberOfTickets: this.numberOfTickets,
                totalPrice: totalPriceVar
            }

            let localRequestOptions = { ...requestOptions }
            localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
            console.log(localRequestOptions.headers.Authorization)
            localRequestOptions.method = "PUT"
            localRequestOptions.body = JSON.stringify(putData)

            fetch(base_url + 'reservations/' + this.$route.query.reservationId, localRequestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        ElNotification({
                            title: 'Success',
                            message: 'The reservation was successfully modified!',
                            type: 'success',
                        })
                        //this.$router.push("/reservations");
                    }
                    console.log(res)
                })

        }
    }
}
</script>

<style>

</style>