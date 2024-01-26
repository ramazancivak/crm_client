// api.js
import { reactive } from 'vue';

export const apiUrl = reactive({
    //Auth
    login: `${process.env.VUE_APP_API_KEY}/auth/login`,
    isLogin: `${process.env.VUE_APP_API_KEY}/auth/isLogin`,
    lagout: `${process.env.VUE_APP_API_KEY}/auth/lagout`,

    //Users
    users: `${process.env.VUE_APP_API_KEY}/user/users`,
    departmans: `${process.env.VUE_APP_API_KEY}/user/departmans`,
    departmansJobs: `${process.env.VUE_APP_API_KEY}/user/departmansJobs`,
    fixtures: `${process.env.VUE_APP_API_KEY}/user/fixtures`,
    customers: `${process.env.VUE_APP_API_KEY}/customer/customers`,

    //Calender
    calender: `${process.env.VUE_APP_API_KEY}/calender`
});