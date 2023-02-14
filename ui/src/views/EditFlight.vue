<template>
    <NavigationUser />
    <el-form :model="form" labelPosition="top">
        <el-space direction="vertical" size="large">
            <el-card class="box-card" style="width: 400px">
                <div>
                    <el-form-item label="Airline">
                        <el-input type="text" placeholder="Flight airline" v-model="airline"></el-input>
                    </el-form-item>
                    <el-form-item label="Origin airport">
                        <el-input type="text" placeholder="Flight origin airport" v-model="originAirport"></el-input>
                    </el-form-item>
                    <el-form-item label="Origin city">
                        <el-input type="text" placeholder="Flight origin city" v-model="originCity"></el-input>
                    </el-form-item>
                    <el-form-item label="Origin country">
                        <el-input type="text" placeholder="Flight origin country" v-model="originCountry"></el-input>
                    </el-form-item>
                    <el-form-item label="Destination airport">
                        <el-input type="text" placeholder="Flight destination airport"
                            v-model="destinationAirport"></el-input>
                    </el-form-item>
                    <el-form-item label="Destination city">
                        <el-input type="text" placeholder="Flight destination city"
                            v-model="destinationCity"></el-input>
                    </el-form-item>
                    <el-form-item label="Destination country">
                        <el-input type="text" placeholder="Flight destination country"
                            v-model="destinationCountry"></el-input>
                    </el-form-item>
                    <el-form-item label="Flight length">
                        <el-input type="text" placeholder="Flight length" v-model.number="flightLength"></el-input>
                    </el-form-item>
                    <el-form-item label="Flight number">
                        <el-input type="text" placeholder="Flight number" v-model.number="flightNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="Date & time">
                        <el-date-picker v-model="date" type="datetime" placeholder="Select date and time" />
                    </el-form-item>
                    <el-form-item label="Price">
                        <el-input v-model.number="price" type="text" placeholder="Price" />
                    </el-form-item>
                    <el-button type="primary" @click="editFlight">Edit flight</el-button>
                </div>
            </el-card>
        </el-space>
    </el-form>
</template>

<script>
import { base_url, requestOptions } from '@/utils/requestOptions';
import moment from "moment";
import { ElNotification } from 'element-plus'
import NavigationUser from '@/components/NavigationUser'

export default {
    name: 'Flight',
    props: {
        flight: {
            type: Object
        }
    },
    components: {
        NavigationUser
    },
    data() {
        return {
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
        }
    },
    methods: {
        editFlight() {

            let postData = {
                airline: this.airline,
                origin: {
                    name: this.originAirport,
                    city: this.originCity,
                    country: this.originCountry
                },
                destination: {
                    name: this.destinationAirport,
                    city: this.destinationCity,
                    country: this.destinationCountry
                },
                flightLength: this.flightLength,
                flightNumber: this.flightNumber,
                date: moment(this.date).utc().format('YYYY-MM-DD HH:mm:ss'),
                price: this.price
            }

            let localRequestOptions = { ...requestOptions }
            localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
            console.log(localRequestOptions.headers.Authorization)
            localRequestOptions.method = "PUT"
            localRequestOptions.body = JSON.stringify(postData)

            fetch(base_url + 'flights/' + this.$route.query.flightId, localRequestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        ElNotification({
                            title: 'Success',
                            message: 'This flight was successfully edited',
                            type: 'success',
                        })
                    }
                    console.log(res)
                })


        }
    }
}
</script>

<style>

</style>