import axios from "axios";

const httpService = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  timeout: 60000, 
});

export default httpService;
