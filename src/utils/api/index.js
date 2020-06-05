import authInterceptor from './interceptors/auth'
import redirectLoginInterceptor from './interceptors/redirectLogin'
import errorMessageInterceptor from './interceptors/errorMessage'

const axios = require('axios')
const { baseUrl } = require('../config/servers');

axios.defaults.timeout = 30000;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
})

const resultApi = [api]

resultApi.forEach((axiosInst) => {
  authInterceptor(axiosInst)
  redirectLoginInterceptor(axiosInst)
  errorMessageInterceptor(axiosInst)
});