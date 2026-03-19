import axios from "axios";


const axiosInstance = axios.create({
    baseUrl: "http://localhost:3000/"
});

const useAxios = () =>{
    return axiosInstance
};

export default useAxios;