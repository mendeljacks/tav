import { makeAutoObservable } from 'mobx'
import axios from 'axios'

class Login {
    constructor() {
        makeAutoObservable(this)
    }

    email = ''
    password = ''

    invalid_email = false
    invalid_password = false
    error = ''

    loading_login = false

    set_email = (str) => {
        this.clear_errors()
        this.email = str
    }
    set_password = (str) => {
        this.clear_errors()
        this.password = str
    }
    forgot_password = async () => {
        try {
			window.alert('Password reset successful! Check your email for your new password')
		} catch (err) {
            this.error = JSON.stringify(err)
		}
    }

    login_disabled = () => {
        return login_store.email === '' || login_store.password === ''
    }
    clear_errors = () => {
        this.invalid_email = false
        this.invalid_password = false
        this.error = ''
    }

    login = async () => {
        if (this.login_disabled()) return
        this.clear_errors()
        this.loading_login = true
        // await new Promise(res => setTimeout(res, 3000))
        try {
            const login_response = await axios.post('http://localhost:5000/login', {
                email: this.email,
                password: this.password
            })
            .catch(err => Promise.reject(err.response.data))

            window.alert(JSON.stringify(login_response))
       
        } catch (err) {
            console.error(err)
            const message = err
            const invalid_email = typeof message === 'string' && message.includes('email')
            const invalid_password = typeof message === 'string' && message.includes('password')
            this.invalid_email = invalid_email
            this.invalid_password = invalid_password
            if (!invalid_email && !invalid_password) {
                this.error = JSON.stringify(err, null, 2)
            }
        } finally {
            this.loading_login = false
        }
    }

    logout = () => {
        // shared.set_state('token', '')
    }

}

export const login_store = new Login()
window.login_store = login_store