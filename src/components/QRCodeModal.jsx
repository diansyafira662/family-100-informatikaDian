import React, { useState } from 'react';
import { generateQRCodeSVG, generateOfflineQRSVG } from '../utils/qrGenerator';

export default function QRCodeModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://family100-informatika.web.app';
  const qrImageSrc = generateQRCodeSVG(currentUrl);
  const offlineSvg = generateOfflineQRSVG(currentUrl);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      alert(`Link Aplikasi: ${currentUrl}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <div className="modal-header">
          <h3 className="modal-title">📱 AKSE S APLIKASI VIA QR CODE</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '16px' }}>
          Pindai QR Code di bawah menggunakan kamera smartphone (Android / iPhone) untuk bergabung & bermain!
        </p>

        {/* QR Code Container with offline SVG fallback */}
        <div
          style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '16px',
            display: 'inline-block',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            marginBottom: '16px'
          }}
        >
          <img
            src={qrImageSrc}
            alt="QR Code Aplikasi Family 100 Informatika"
            style={{ width: '220px', height: '220px', display: 'block' }}
            onError={(e) => {
              // Fallback to offline SVG if network fails
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: offlineSvg }}
          />
        </div>

        <div style={{ wordBreak: 'break-all', fontSize: '0.85rem', color: '#4ade80', marginBottom: '16px' }}>
          {currentUrl}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={handleCopyLink}>
            {copied ? '✅ LINK BERHASIL DISALIN!' : '📋 SALIN LINK'}
          </button>

          <button className="btn btn-secondary" onClick={onClose}>
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
}
