<template>
  <div>
    <!-- <HomeView/> -->
    <!-- <div> -->
      <!-- <Navigation/> -->
      <!-- <NavigationUser v-if="isAuthenticated" key="$route.fullPath"/> -->
    <!-- </div> -->
    <router-view />
  </div>
</template>

<script>

//const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
import { ElNotification } from 'element-plus'

import { ref } from 'vue'
import Navigation from "./components/Navigation";
import NavigationUser from "./components/NavigationUser";
import HomeView from "@/views/HomeView";

import { watch } from "vue"
import { useRoute } from 'vue-router'

// if(this.$router == '/reservations') {
//   const activeIndex = ref('5')
// } else {
const activeIndex = ref('1')
// }

export function myPlugin(route) {
  watch(route.query, (newQuery, oldQuery) => {
    // TODO
  })
}

// const route = useRoute();
// watch ( () => route.meta.layout, layout => {
//   console.log(layout);
// })

export default {
  name: "App",
  components: {
    //HomeView
    //App,
    //Navigation,
    // NavigationUser
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
