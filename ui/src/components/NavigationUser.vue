<template>
    <nav key="$route.fullPath">
        <el-menu :default-active="activeIndex" mode="horizontal" background-color=rgb(192,192,192) text-color="#fff"
            active-text-color="#ffd04b" @select="handleSelect" ellipsis="true" >
            <div class="flex-grow" />
            <el-menu-item index="1"><router-link to="/">Home</router-link> </el-menu-item>
            <!-- <el-menu-item index="2" v-if="isNotAuthenticated"><router-link to="/register"
                    v-show="isNotAuthenticated">Register</router-link>
            </el-menu-item>
            <el-menu-item index="3" v-if="isNotAuthenticated"><router-link to="/login"
                    v-show="isNotAuthenticated">Login</router-link>
            </el-menu-item> -->
            <el-menu-item index="2" v-if="isAuthenticated && isAdmin"> <router-link to="/addFlight"
                    v-show="isAuthenticated && isAdmin">Add a
                    flight</router-link> </el-menu-item>
            <el-menu-item index="3" v-if="isAuthenticated"><router-link to="/reservations"
                    v-show="isAuthenticated">Reservations</router-link>
            </el-menu-item>
            <el-menu-item text-color=rgb(250,250,250) index="0" style='margin-left: auto;' v-if="isAuthenticated"
                @click="handleLogout">LOGOUT</el-menu-item>
            <!-- <router-link to="/addReservation">Add a reservation</router-link> -->
        </el-menu>
    </nav>
    <!-- <router-view /> -->
</template>

<script>

//const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
import { ElNotification } from 'element-plus'

import { ref } from 'vue'

// if(this.$router == '/reservations') {
//   const activeIndex = ref('5')
// } else {
const activeIndex = ref('/')
// }

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
        // username() {
        //   // We will see what `params` is shortly
        //   return this.$route.params.username
        // },
        // isAuthenticated() {
        //   return this.$store.state.isAuthenticated;
        // },
        // isNotAuthenticated() {
        //   return !(this.$store.state.isAuthenticated);
        // },
        // isAdmin() {
        //   return this.$store.state.isAdmin;
        // }
        login() {
            return this.$store.state.isAuthenticated;
        },
        isAuthenticated() {
            if (localStorage.getItem("token") == "" || !localStorage.hasOwnProperty("token")) {
                return false;
            } else if (localStorage.getItem("token") != "" && localStorage.hasOwnProperty("token")) {
                return true;
            }
            //return this.$store.state.isAuthenticated;
        },
        isNotAuthenticated() {
            if (localStorage.getItem("token") == "" || !(localStorage.hasOwnProperty("token"))) {
                return true;
            } else if (localStorage.getItem("token") != "" && localStorage.hasOwnProperty("token")) {
                return false;
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
        }
    },
    methods: {
        // goToDashboard() {
        //   if (isAuthenticated) {
        //     this.$router.push('/dashboard')
        //   } else {
        //     this.$router.push('/login')
        //   }
        // },
        handleLogout() {
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

            this.isSignedIn = false;
            //this.$store.commit("SET_AUTH", false);

            this.$router
                .push({ path: '/login' })
            //.then(() => { this.$router.go() })
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

/* .flex-grow {
  flex-grow: 0;
} */
</style>