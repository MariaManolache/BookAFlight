<template>
    <Navigation />
    <el-form :model="form">
        <el-space direction="vertical" size="large">
            <el-card class="box-card" style="width: 250px">
                <div class="login">
                    <p style="text-align:center;">Login</p>
                    <el-form-item>
                        <!-- <input type="text" placeholder="Email" v-model="email"> -->
                        <el-input v-model="email" class="w-50 m-2" placeholder="Please input email address" clearable />
                    </el-form-item>
                    <el-form-item>
                        <!-- <input type="text" placeholder="Password" v-model="password"> -->
                        <el-input v-model="password" class="w-50 m-2" type="password"
                            placeholder="Please input password" show-password clearable />
                    </el-form-item>
                    <!-- <button @click="login">Login</button> -->
                    <el-button type="success" plain @click="login">Login</el-button>
                </div>
            </el-card>
        </el-space>
    </el-form>
</template>

<script>
import { base_url, requestOptions } from '@/utils/requestOptions';
// import { UiButton } from 'balm-ui/components/button';
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

import { ElButton } from 'element-plus'
import { h } from 'vue'
import { ElNotification } from 'element-plus'
import Navigation from '@/components/Navigation'

export default {
    name: 'Login',
    data() {
        return {
            email: "",
            password: "",
            isSignedIn: this.$store.state.isAuthenticated
        };
    },
    // created() {
    //     this.checkSignedIn()
    // },
    // updated() {
    //     this.checkSignedIn()
    // },
    computed: {
        isAuthentif() {
            return this.$store.state.isAuthentif;
        }
    },
    methods: {
        // checkSignedIn() {
        //     if (this.isSignedIn) {
        //         this.$router.replace('/')
        //     }
        // },
        login() {
            if (this.email.length > 1 && this.password.length > 1) {
                console.log("vrei sa trimiti: ", this.email + " / " + this.password);
                let localRequestOptions = { ...requestOptions };
                localRequestOptions.method = "POST";
                let postData = {
                    email: this.email,
                    password: this.password,
                };
                localRequestOptions.body = JSON.stringify(postData);
                fetch(base_url + "login", localRequestOptions)
                    .then((res) => {
                        if (res.status === 200) {

                            console.log(res);
                            let token = res.json().then((res) => {
                                token = res.token;
                                localStorage.setItem("token", token);
                                console.log(token);
                                localStorage.setItem("userId", res.doc)
                                console.log(res.doc)
                                localStorage.setItem("isAdmin", res.isAdmin)
                                // this.$store.state.isAdmin = res.isAdmin
                                console.log(res.isAdmin)
                                ElNotification({
                                    title: 'Login Successfull',
                                    message: h('i', { style: 'color: teal' }, 'The login was successfull!'),
                                    type: 'success'
                                })

                                this.isSignedIn = this.$store.state.isAuthenticated;

                                this.$router
                                    .push({ path: '/' })
 
                            });
                        } else if (res.status === 403) {
                            ElNotification({
                                title: 'Wrong password',
                                message: 'You entered the wrong password for this user. Try again!',
                                type: 'error',
                            })
                        } else if (res.status === 404) {
                            ElNotification({
                                title: 'Missing user',
                                message: 'The email address is not registered!',
                                type: 'error',
                            })
                        }
                        // this.$notification(
                        // 'Good job!', 
                        // 'You clicked the button!',
                        // 'success', 
                        // async () => {
                        // console.log('Clicked notification')
                        //         }, 
                        // 'A minute ago'
                        // )
                    });
            } else {
                ElNotification({
                    title: 'Missing user or password',
                    message: 'You need to enter the user and password in order to log in!',
                    type: 'error',
                })
            }

        }
    },
    components: { Navigation }
}
</script>

<style>
.login {
    color: green;
}
</style>

