import axios from "./axios";

const fecthAllUser = (page) => {
    return axios.get(`/api/users?page=${page}`);
};

const postCreateUser = (name, job) => {
    return axios.post("/api/users", {name, job})
}

const putUpdateUser = (name, job) => {
    return axios.put("/api/users", {name, job})
}

const deleteUser = (id) => {
    return axios.delete(`/api/users/${id}`);
}

const loginApi = (email, password) => {
    return axios.post("/api/login", {email, password});
}

export { fecthAllUser, postCreateUser, putUpdateUser, deleteUser, loginApi };
