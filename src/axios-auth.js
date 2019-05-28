// Creating axios instances
// We can use them with import whatevername from 'ourInstanceFile'
import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://vue-axios-auth-89c4b.firebaseio.com'
})

instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance