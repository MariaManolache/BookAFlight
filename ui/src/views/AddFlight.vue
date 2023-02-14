<template>
    <NavigationUser />
    <div>
    <el-form :model="form">
        <el-space direction="vertical" size="large">
            <el-card class="box-card" style="width: 400px">
                <div>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight airline" v-model="airline"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight origin airport" v-model="originAirport"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight origin city" v-model="originCity"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight origin country" v-model="originCountry"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight destination airport"
                            v-model="destinationAirport"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight destination city"
                            v-model="destinationCity"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight destination country"
                            v-model="destinationCountry"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight length" v-model.number="flightLength"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input type="text" placeholder="Flight number" v-model.number="flightNumber"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="date" type="datetime" placeholder="Select date and time" />
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model.number="price" type="text" placeholder="Price" />
                    </el-form-item>
                    <el-button type="primary" @click="addFlight">Add flight</el-button>
                </div>
            </el-card>
        </el-space>
    </el-form>
</div>
</template>

<script>
import { base_url, requestOptions } from '@/utils/requestOptions';
import moment from "moment";
import { ElNotification } from 'element-plus'
import NavigationUser from '@/components/NavigationUser'

export default {
    components: {
        NavigationUser
    },
    data() {
        return {
            airline: '',
            originAirport: '',
            originCity: '',
            originCountry: '',
            destinationAirport: '',
            destinationCity: '',
            destinationCountry: '',
            flightLength: '',
            flightNumber: '',
            date: '',
            price: ''
        }
    },
    computed: {
        isAuthentif() {
            return this.$store.state.isAuthentif;
        }
    },
    methods: {
        addFlight() {
            console.log('vrei sa trimiti flight: ', this.airline + ' / ' + this.originAirport + ' / ' + this.destinationAirport)
            let postData = {
                details: {
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
                    date: moment(this.date).utc().format('YYYY-MM-DD HH:mm:ss')
                },
                price: this.price
            }

            let localRequestOptions = { ...requestOptions }
            localRequestOptions.headers.Authorization = "Bearer " + localStorage.getItem('token')
            console.log(localRequestOptions.headers.Authorization)
            localRequestOptions.method = "POST"
            localRequestOptions.body = JSON.stringify(postData)

            fetch(base_url + 'flights', localRequestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        ElNotification({
                            title: 'Flight added',
                            message: 'The flight was successfully added to the database',
                            type: 'success',
                        })
                        this.airline = ""
                        this.originAirport = ""
                        this.originCity = ""
                        this.originCountry = ""
                        this.destinationAirport = ""
                        this.destinationCity = ""
                        this.destinationCountry = ""
                        this.flightLength = ""
                        this.flightNumber = ""
                        this.flightLength = ""
                        this.date = ""
                        this.price = ""

                    } else if (res.status === 500) {
                        ElNotification({
                            title: 'Error',
                            message: 'The flight was not added to the database',
                            type: 'error',
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