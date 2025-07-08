'use client';
import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

export default function QRPage() {
  const appUrl = 'gallimall.vercel.app';
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    toPng(qrRef.current)
      .then((dataUrl) => {
        download(dataUrl, 'gallimall-qr.png');
      })
      .catch((err) => {
        console.error('Failed to download QR:', err);
      });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-xl font-semibold mb-4">Scan to Open GalliMall</h1>

      <div ref={qrRef} className="bg-white p-4 rounded-md shadow-md">
        <QRCode value={appUrl} size={256} />
      </div>

      <p className="mt-2 text-gray-600">{appUrl}</p>

      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download QR Code
      </button>
    </div>
  );
}
