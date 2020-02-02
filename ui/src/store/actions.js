import Vue from "vue"
import isTokenExpired from "../helpers/token"

export default {
  updateHash: (context, hash) => {
    context.commit('setHashContext', hash)
    context.dispatch('updateFileData', hash)
  },
  updateLoggedIn: (context, payload) => {
    if (!payload) {
      return
    }
    context.commit("setLoggedIn", Boolean(payload) && !isTokenExpired(payload))
    context.dispatch("updateUsername", payload)
  },
  updateUsername: (context, payload) => {
    if (!payload) {
      return
    }
    const jwtData = JSON.parse(atob(payload))
    context.dispatch('updateUserData', jwtData.name)
  },
  logOut: (context) => {
    Vue.$cookies.remove("JWTPayload")
    context.commit("setLoggedIn", false)
    context.commit("setUserData", {})
  },
  updateFileData: (context, hash) => {
    Vue.prototype.$http.get(Vue.prototype.$api_endpoints.FILES + hash)
      .then((res) => {
        context.commit('setFileData', res)
      })
      .catch(() => Vue.prototype.$awn.alert(
        "Sorry, we couldn't find the file you were looking for, please upload it to view the results!",
      ))
  },
  updateUserData: (context, username) => {
    Vue.prototype.$http.get(Vue.prototype.$api_endpoints.USERS + username)
      .then((res) => context.commit('setUserData', res.data))
      .catch(console.log)
  }
}
