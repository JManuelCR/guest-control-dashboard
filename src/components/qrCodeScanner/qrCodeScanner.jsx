import './qrCodeScanner.css'
import {Html5QrcodeScanner} from "html5-qrcode";
import {Html5Qrcode} from "html5-qrcode";
import { useEffect, useRef } from 'react';


const QrCodeScanner = ({findUser}) => {

    const scannerRef = useRef(null);
    useEffect(() => {
    const onScanSuccess = (decodedText, decodedResult) => {
       const scannerObject = JSON.parse(decodedText)
      findUser(scannerObject.nombre);
      // Aquí puedes llamar a una función, actualizar un state, navegar, etc.
    };

    const onScanFailure = (error) => {
      // No es necesario mostrar todos los errores; son comunes al escanear
      // console.warn("Error de escaneo:", error);
    };

    // Crear instancia del escáner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);

    // Cleanup al desmontar el componente
    return () => {
      scanner.clear().catch(error => {
        console.error("Error al limpiar el escáner", error);
      });
    };

  }, []);
  

 return (
<section className='scanner-container'>
    <h1>Escanea el código QR del invitado</h1>
    <div id="reader" width="600px"></div>
</section>
 )
}

export default QrCodeScanner;