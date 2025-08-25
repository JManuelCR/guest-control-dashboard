import { useContext } from "react";
import { DataContext } from "./DataContext";

export const useData = () => {
    const context = useContext(DataContext);
    return context;
};