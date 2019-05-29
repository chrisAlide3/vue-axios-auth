import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
// The axios import here is to set global settings for axios
// We still need to import axios on each component we use axios. The imports will be merged
import axios from 'axios'

axios.defaults.baseURL = 'https://vue-axios-auth-89c4b.firebaseio.com'
// We can set global headers. Common will be used on all requests (get, put, post etc..)
// In the [] we can add new header fields or change the value of existing header fields
// axios.defaults.headers.common['Authorisation'] = 'whatever'
// axios.defaults.headers.get['Accepts'] = 'application/json'

// Interceptors can be globaly defined. We need to return at least the incoming argument to exit the interceptor!
// Here we can intercept each request or response generated through axios and manipulate its data
axios.interceptors.request.use(config => {
  console.log('Request interceptor ', config)
  // config.headers['newHeaderFromInterceptor'] = 'newValue'
  return config
})
axios.interceptors.response.use(res => {
  console.log('Response interceptor: ', res)
  return res
})

Vue.use(Vuelidate)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
