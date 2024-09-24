'use client';

import React, { useRef, useEffect, useState } from 'react';
import Quagga from '@ericblade/quagga2'; // Make sure to install this package
import axios from 'axios';


interface FoodInfo {
  name: string;
  calories: number;
}

const BarcodeScannerPage = () => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [foodInfo, setFoodInfo] = useState<FoodInfo | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: scannerRef.current, // Attach camera to this DOM element
            constraints: {
              width: 1280, // Adjust for higher resolution
              height: 720,
              facingMode: 'environment', // Use back camera
            },
          },
          decoder: {
            readers: [
              'ean_reader',        // EAN-13 barcode type
              'code_128_reader',   // Code-128 barcode type
              'ean_8_reader',      // EAN-8 barcode type
              'upc_reader',        // UPC-A barcode type
            ],
          },
          locate: true, // Set to true for locating barcode more efficiently
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
          } else {
            console.log('Quagga initialized successfully');
            Quagga.start();
          }
        }
      );

      // Barcode detected handler
      Quagga.onDetected((result) => {
        console.log('Detection result:', result);
        if (result && result.codeResult && result.codeResult.code) {
          handleDetected(result.codeResult.code);
          Quagga.stop(); // Stop scanning after a barcode is detected
        }
      });

      return () => {
        Quagga.stop(); // Stop the scanner when component unmounts
      };
    }
  }, []);

  const handleDetected = async (barcode: string) => {
    console.log('Detected barcode:', barcode);
    try {
      const response = await axios.post('/api/barcode-lookup', { barcode });
      if (response.data.food) {
        setFoodInfo(response.data.food);
        setError('');
      } else {
        setError('No food found for the barcode');
      }
    } catch (err) {
      setError('Error fetching food data');
    }
  };

  return (
    <div>
      <h1>Scan a Barcode</h1>
      <div ref={scannerRef} style={{ width: '100%', height: '400px' }} /> {/* This is where the camera feed will be rendered */}
      {error && <p className="text-red-500">{error}</p>}
      {foodInfo && (
        <div>
          <h2>Food Information</h2>
          <p>Name: {foodInfo.name}</p>
          <p>Calories: {foodInfo.calories}</p>
          {/* Display other food details */}
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerPage;
