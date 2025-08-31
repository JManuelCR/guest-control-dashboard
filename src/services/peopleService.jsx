import { API } from "./auth";

const getGuests = () => {
    return API.get("guest/guests");
}

const getGuestById = (id) => {
    return API.get(`guest/${id}`);
}

const patchGuest = (id, data) => {
    return API.patch(`guest/${id}`, data);
}

export { getGuests, getGuestById, patchGuest };
