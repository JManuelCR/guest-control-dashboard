import axios from "axios";
import API_CONFIG from "../config/api.js";


// Configuración de la API usando la configuración centralizada
const API = axios.create({
  baseURL: API_CONFIG.getBaseUrl()
});


const updateGuest = async (guest) => {
    try{
        const response = await API.patch(`/guest/${guest.guestInvitationId}`, guest)

        if(response.status === 200 && response.data){
            return response.data;
        }
    }catch (error) {
        return{
            success: false,
            error:error.response?.data?.message || error.message || 'Error de conexión'
        };
    }
}

export {
    updateGuest
}