<template>
  <div id="signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">
        <!-- email -->
        <!-- We add an invalid class through v-bind(:) and assign the value of the validator email field 
             so $v holds the infos of all the validator on the form. We access the email validator
             and access the $error boolean of the email validator 
             $.dirty = true means the field has been touched-->
        <div class="input" :class='{invalid: $v.email.$error}'>
          <label for="email">Mail
            <sup v-if="$v.email.$params.required">*</sup>
          </label>
          <!-- @input='$v' binds the input to the vuelify validators.
              We can use other v-ons like @blur to fire the validation once the user exits the field
              Then access the wished validator with .validatorName. 
              Finally inform vuelify to execute the navigator with the .touch() inbuild functio
              Here $v.email.$touch(). This insures that $dirty, $error are handled correctly 
              $dirty = true means the field has been touched -->
          <input
                  type="email"
                  id="email"
                  @blur="$v.email.$touch()"
                  v-model="email">
          <!-- We only display errors when the field has been touched with the $dirty property
              In our case the touch() will be triggered when we exit the field (@blur)-->
          <p class="error" v-if="!$v.email.email &$v.email.$dirty">Please enter a valid email address</p>
          <p class="error" v-if="!$v.email.required & $v.email.$dirty">Please enter your email</p>
          <p class="error" v-if="!$v.email.unique & $v.email.$dirty">This email is already taken. Please Sign In</p>
        </div>
        <!-- Age -->
        <div class="input" :class="{invalid: $v.age.$error}">
          <label for="age">Your Age
            <sup v-if="$v.age.$params.required">*</sup>
          </label>
          <input
                  type="number"
                  id="age"
                  @blur="$v.age.$touch()"
                  v-model.number="age">
          <!-- We only display errors when the field has been touched with the $dirty property
              In our case the touch() will be triggered when we exit the field (@blur)-->
          <p class="error" v-if="!$v.age.minVal &$v.age.$dirty">You must be at least {{ $v.age.$params.minVal.min }} years old to subscribe</p>
          <p class="error" v-if="!$v.age.required & $v.age.$dirty">Please enter your age</p>
        </div>
        <!-- Password -->
        <div class="input" :class="{invalid: $v.password.$error}">
          <label for="password">Password
            <sup v-if="$v.password.$params.required">*</sup>
          </label>
          <input
                  type="password"
                  id="password"
                  @blur="$v.password.$touch()"
                  v-model="password">
          <p class="error" v-if="!$v.password.required  & $v.password.$dirty">Please enter a password</p>
          <p class="error" v-if="!$v.password.minLen  & $v.password.$dirty">Password must be at least {{ $v.password.$params.minLen.min }} character long</p>

        </div>
        <!-- Confirm password -->
        <div class="input" :class="{invalid: $v.confirmPassword.$error}">
          <label for="confirm-password">Confirm Password
            <sup v-if="$v.email.$params.required">*</sup>
          </label>
          <input
                  type="password"
                  id="confirm-password"
                  @blur="$v.confirmPassword.$touch()"
                  v-model="confirmPassword">
          <p class="error" v-if="!$v.confirmPassword.sameAs  & $v.confirmPassword.$dirty">Password doesn't match</p>
        </div>
        <!-- Country -->
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">USA</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>
        <!-- Hobbies -->
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div
                    class="input"
                    v-for="(hobbyInput, index) in hobbyInputs"
                    :class="{invalid: $v.hobbyInputs.$each[index].$error}"
                    :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                      type="text"
                      :id="hobbyInput.id"
                      @blur="$v.hobbyInputs.$each[index].value.$touch()"
                      v-model="hobbyInput.value">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
              <p class="error" v-if="!$v.hobbyInputs.$each[index].value.minLen">Hobbies need at least 5 characters</p>
            </div>
            <p class="error" v-if="!$v.hobbyInputs.minLen">You need to add at least {{ $v.hobbyInputs.$params.minLen.min }} hobby</p>
            <p class="error" v-if="!$v.hobbyInputs.required">Please add hobbies</p>          
          </div>
        </div>
        <!-- Terms of use -->
          <!-- Here we check $invalid instead of error to mark it red on load -->
        <div class="input inline" :class="{invalid: !$v.terms.requiredUnless}">
          <input  type="checkbox" 
                  id="terms"
                  @change="$v.terms.$touch()" 
                  v-model="terms">
          <label for="terms">Accept Terms of Use</label>
          <p>{{ $v.terms }}</p>

        </div>
        <!-- Submit -->
        <div class="submit">
          <button type="submit" :disabled="$v.$invalid">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// We need to import validators from the vuelidate package. Full list on webpage under bulletin validators
import { required, email, minValue, numeric, minLength, sameAs, requiredUnless } from 'vuelidate/lib/validators'
// Here we use the axios instance created in axios-auth.js
// Got moved to store.js
// import axios from '../../axios-auth'
  export default {
    data () {
      return {
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'usa',
        hobbyInputs: [],
        terms: false
      }
    },
    validations: {
      email: {
        required,
        email,
// Custom validators. Asynchronus with promise
        unique: val => {
          if (val === '') return true
          return axios.get('/users.json?orderBy="email"&equalTo="' + val + '"')
            .then(res => {
              console.log(res)
              // axios returns an empty data object if he don't find the email
              return Object.keys(res.data).length === 0
            })
          // return new Promise((resolve, reject) => {
          //   setTimeout(() => {
          //     resolve(val !== 'test@test.com')
          //   },3000)
          // })
        }
      },
      age: {
        required,
        numeric,
        minVal: minValue(18)
      },
      password: {
        required,
        minLen: minLength(6),
      },
      confirmPassword: {
        required,
        sameAs: sameAs('password'),
// samAs can also be defined as a function. It receives the data() method as parameter
// So here we return the password value and add a 'b' to it. Now it will check confirmPassword with password+b
//        sameAs: sameAs(vm => {
//          return vm.password + 'b'
//        })
      },
      terms: {
// Check box required is always true. We need to use sameAs
//      required
        requiredUnless: sameAs(vm => {
            return vm.country !== 'germany'
        })
      },
      hobbyInputs: {
        required,
        // Now we are on the array. Here we specify that we need at lest 1 element in the array
        minLen: minLength(2),
        // With $each we loop through the array and touch each object in the array
        $each: {
          // Here we acces the input value of it
          value: {
            // And set the validation rules like on email, paswords etc..
            // Here we check the minimal length of the inputed characters
            minLen: minLength(5)
          }
        }
      }
    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms
        }
        this.$store.dispatch('signUp', formData)
      }
    }
  }
</script>

<style scoped>
sup {
  color: red;
}
.error {
  color: red;
  font-size: smaller;
}
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  /* Defining the style for the validators invalid class */
  .input.invalid input {
    border: 1px solid red;
    background-color: #f7b4b4;
  }
  .input.invalid label{
    color: red;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>