<template>
    <Navigation />
    <el-form :model="form">
        <el-space direction="vertical" size="large">
            <el-card class="box-card" style="width: 250px">
                <div class="register">
                    <p>You want to register</p>
                    <el-form-item>
                        <el-input v-model="lastName" placeholder="Last name" clearable />
                    </el-form-item>
                    <!-- <input type="text" placeholder="First name" v-model="firstName"> -->
                    <el-form-item>
                        <el-input v-model="firstName" placeholder="First name" clearable />
                    </el-form-item>
                    <!-- <input type="text" placeholder="Last name" v-model="lastName"> -->
                    <el-form-item>
                        <el-input v-model="email" placeholder="Email" clearable />
                    </el-form-item>
                    <!-- <input type="text" placeholder="Email" v-model="email"> -->
                    <el-form-item>
                        <el-input v-model="phoneNumber" placeholder="Phone number" clearable />
                    </el-form-item>
                    <!-- <input type="text" placeholder="Phone number" v-model="phoneNumber"> -->
                    <el-form-item>
                        <el-input v-model="password" class="w-50 m-2" type="password"
                            placeholder="Please input password" show-password clearable />
                    </el-form-item>
                    <!-- <input type="text" placeholder="Password" v-model="password"> -->
                    <el-button type="success" plain @click="register">Register</el-button>
                    <!-- <button @click="register">Register</button> -->

                </div>
            </el-card>
        </el-space>
    </el-form>
</template>

<script>
import { base_url, requestOptions } from '@/utils/requestOptions';
import { ElNotification } from 'element-plus'
import Navigation from '@/components/Navigation'
import { ref } from 'vue'
// import Vue from 'vue'
// import notification from 'vue-notification-ui'

// Vue.use(notification, {
//   position: 'notification-top-right', // top, bottom, left, right
//   duration: 5000, // default
//   left: 20, // default
//   bottom: 20, // default
//   top: 20, // default
//   right: 40 // default
// })
let activateIndex = ref('1')

export default {
    name: 'Register',
    components: {
        Navigation
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
        }
    },
    computed: {
        isAuthentif() {
            return this.$store.state.isAuthentif;
        }
    },
    methods: {
        register() {
            if (this.firstName.length <= 1 || this.lastName.length <= 1 || this.email.length <= 1 ||
                this.phoneNumber.length <= 1 || this.password.length <= 1) {
                if (this.firstName.length <= 1) {
                    ElNotification({
                        title: 'First Name Missing',
                        message: 'The first name is not entered!',
                        type: 'error',
                    })
                } if (this.lastName.length <= 1) {
                    ElNotification({
                        title: 'Last Name Missing',
                        message: 'The last name is not entered!',
                        type: 'error',
                    })
                } if (this.email.length <= 1) {
                    ElNotification({
                        title: 'Email Missing',
                        message: 'Email is not entered!',
                        type: 'error',
                    })
                } if (this.phoneNumber.length <= 1) {
                    ElNotification({
                        title: 'Phone Number Missing',
                        message: 'The phone number is not entered!',
                        type: 'error',
                    })
                } if (this.password.length <= 1) {
                    ElNotification({
                        title: 'Password Missing',
                        message: 'Password is not entered!',
                        type: 'error',
                    })
                }
            } else {
                console.log('vrei sa trimiti: ', this.firstName + ' / ' + this.lastName + ' / ' +
                    this.email + ' / ' + this.phoneNumber + ' / ' + this.password)
                let localRequestOptions = { ...requestOptions }
                localRequestOptions.method = "POST"
                let postData = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    phoneNumber: this.phoneNumber,
                    password: this.password,
                }

                localRequestOptions.body = JSON.stringify(postData)

                fetch(base_url + 'register', localRequestOptions)
                    .then((res) => {
                        if (res.status === 200) {
                            ElNotification({
                                title: 'User added',
                                message: 'You successfully created an account!',
                                type: 'success',
                            })
                            this.$router
                                .push({ path: '/login' })
                            //.then(() => { this.$router.go() })
                            console.log(res)
                        } else if (res.status === 500) {
                            ElNotification({
                                title: 'Existing account',
                                message: 'An account already exists for this email address. Try to log in!',
                                type: 'error',
                            })
                        }

                    })
            }


        }
    }
}
</script>

<style>
.register {
    color: green;
}
</style>