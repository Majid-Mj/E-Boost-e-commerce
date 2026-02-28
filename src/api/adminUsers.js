import api from "../config/api";

export const getUsers = () => {
    return api.get("/admin/users/Users");
};

export const toggleBlockUser = (id) => {
    return api.patch(`/admin/users/${id}/toggle-block`);
};