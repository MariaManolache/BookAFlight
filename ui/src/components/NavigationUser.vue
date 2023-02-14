<template>
    <nav key="$route.fullPath">
        <el-menu :default-active="activeIndex" mode="horizontal" background-color=rgb(192,192,192) text-color="#fff"
            active-text-color="#ffd04b" @select="handleSelect" ellipsis="true" >
            <div class="flex-grow" />
            <el-menu-item index="1"><router-link to="/">Home</router-link> </el-menu-item>
            <el-menu-item index="2" v-if="isAuthenticated && isAdmin"> <router-link to="/addFlight"
                    v-show="isAuthenticated && isAdmin">Add a
                    flight</router-link> </el-menu-item>
            <el-menu-item index="3" v-if="isAuthenticated"><router-link to="/reservations"
                    v-show="isAuthenticated">Reservations</router-link>
            </el-menu-item>
            <el-menu-item text-color=rgb(250,250,250) index="0" style='margin-left: auto;' v-if="isAuthenticated"
                @click="handleLogout">LOGOUT</el-menu-item>
        </el-menu>
    </nav>
</template>

<script>

import { ElNotification } from 'element-plus'

import { ref } from 'vue'

const activeIndex = ref('/')

export default {
    name: "NavigationUser",
    data() {
        return {
            isSignedIn: this.$store.state.isAuthenticated
        }
    },
    beforeCreate() {
        this.isSignedIn = this.$store.state.isAuthenticated
        console.log('issignedin: ' + this.isSignedIn)
    },
    components: {
        Navigation
    },
    computed: {
        login() {
            return this.$store.state.isAuthenticated;
        },
        isAuthenticated() {
            if (localStorage.getItem("token") == "" || !localStorage.hasOwnProperty("token")) {
                return false;
            } else if (localStorage.getItem("token") != "" && localStorage.hasOwnProperty("token")) {
                return true;
            }
        },
        isNotAuthenticated() {
            if (localStorage.getItem("token") == "" || !(localStorage.hasOwnProperty("token"))) {
                return true;
            } else if (localStorage.getItem("token") != "" && localStorage.hasOwnProperty("token")) {
                return false;
            }
        },
        isAdmin() {
            if (localStorage.getItem("isAdmin") == "true") {
                return true;
            } else if (localStorage.getItem("isAdmin") == "false") {
                return false;
            }
        }
    },
    methods: {
        handleLogout() {
            ElNotification({
                title: 'LOGOUT',
                message: 'You just logged out from your account!',
                type: 'info',
            })
            localStorage.removeItem("token");
            localStorage.removeItem("isAdmin")
            this.$store.state.isAdmin = "false"

            this.isSignedIn = false;

            this.$router
                .push({ path: '/login' })
        }
    },
}

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

nav {
    padding: 30px;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
}

nav a.router-link-exact-active {
    color: #42b983;
}

</style>