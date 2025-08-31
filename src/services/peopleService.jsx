import { API } from "./auth";

const getGuests = () => {
    return API.get("guest/guests");
}

const getGuestById = (id) => {
    return API.get(`guest/guests/${id}`);
}

const patchGuest = (id, data) => {
    return API.patch(`guest/guests/${id}`, data);
}

export { getGuests, getGuestById, patchGuest };
