import { useLocation } from " react-router-dom"
import { DataProvider } from "./context/DataProvider.jsx"
import App from "./App.jsx"

function AppWrapper() {
    location = useLocation();
    return (
        <DataProvider>
            <App />
        </DataProvider>
    )

}

export default AppWrapper;