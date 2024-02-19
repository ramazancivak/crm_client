// api.js
import { reactive } from 'vue';

export const apiUrl = reactive({
    //Auth
    login: `${process.env.VUE_APP_API_URL}/auth/login`,
    isLogin: `${process.env.VUE_APP_API_URL}/auth/isLogin`,
    lagout: `${process.env.VUE_APP_API_URL}/auth/lagout`,

    //Users
    users: `${process.env.VUE_APP_API_URL}/user/users`,
    departmans: `${process.env.VUE_APP_API_URL}/user/departmans`,
    departmansJobs: `${process.env.VUE_APP_API_URL}/user/departmansJobs`,
    fixtures: `${process.env.VUE_APP_API_URL}/user/fixtures`,
    customers: `${process.env.VUE_APP_API_URL}/customer/customers`,

    //Calender
    calender: `${process.env.VUE_APP_API_URL}/calender`
});