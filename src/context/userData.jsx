import { useContext } from "react";
import { DataContext } from "./DataContext";

export const useData = () => {
    const context = useContext(DataContext);
    console.log('useData - Contexto recibido:', context);
    return context;
};