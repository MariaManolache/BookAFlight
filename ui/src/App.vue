<template>
  <div>
    <router-view />
  </div>
</template>

<script>

import { ElNotification } from 'element-plus'

import { ref } from 'vue'

import { watch } from "vue"

const activeIndex = ref('1')

export function myPlugin(route) {
  watch(route.query, (newQuery, oldQuery) => {
  })
}

export default {
  name: "App",
  components: {

  },
  computed: {
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
