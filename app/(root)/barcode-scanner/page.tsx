
'use client';

import { ConstructionIcon } from "lucide-react";

// import { useEffect, useRef, useState } from 'react';
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import axios from 'axios';

// interface ProductInfo {
//   name: string;
//   description: string;
//   // Add other properties as necessary
// }

const BarcodeScannerPage = () => {
  // const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  // const [error, setError] = useState<string>('');
  // const scannerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (!scannerRef.current) return;

  //   // Initialize the html5-qrcode scanner
  //   const scanner = new Html5QrcodeScanner(
  //     scannerRef.current.id,
  //     { fps: 10, qrbox: { width: 300, height: 300 } },
  //     false
  //   );

    // Start scanning for barcodes
  //   scanner.render(handleDetected, handleError);

  //   return () => {
  //     scanner.clear();
  //   };
  // }, []);

  // const handleDetected = async (barcode: string) => {
  //   console.log('Detected barcode:', barcode);

  //   try {
  //     const response = await axios.post('/api/barcode-lookup', { barcode });
  //     if (response.data.product) {
  //       setProductInfo(response.data.product);
  //       setError('');
  //     } else {
  //       setError('No product found for the barcode');
  //     }
  //   } catch (err) {
  //     setError('Error fetching product data');
  //   }
  // };

  // const handleError = (err: any) => {
  //   console.error('Error scanning barcode:', err);
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Scan a Barcode</h1>

      
      <div ref={scannerRef} id="barcode-scanner" className="w-full max-w-md h-96 border-4 border-gray-800 rounded-lg shadow-lg mb-4 flex items-center justify-center" />

     
      {error && <p className="text-red-500 text-lg mt-4">{error}</p>}

     
      {productInfo && (
        <div className="bg-teal-100 text-teal-700 p-4 rounded-lg shadow-md mt-4 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Product Information</h2>
          <p className="text-lg">Name: {productInfo.name}</p>
          <p className="text-lg">Description: {productInfo.description}</p>
        </div>
      )} */}
      <h2>Page Currently under construction <ConstructionIcon className="h-8 w-8 " fill="yellow" /></h2>
    </div>
  );
};

export default BarcodeScannerPage;
