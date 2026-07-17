import { ParcelRecord } from '../types';

/**
 * Generates an ownership proof PDF by opening a formatted HTML document in a new window
 * and triggering the browser's native print API.
 */
export function generateOwnershipProofPdf(parcel: ParcelRecord, verifierName: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the ownership proof.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Ownership Proof - Parcel #${parcel.id.toString()}</title>
        <style>
          body {
            font-family: 'Public Sans', 'Inter', sans-serif;
            margin: 40px;
            color: #191c1d;
            background-color: #ffffff;
          }
          .header {
            border-bottom: 2px solid #012d1d;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #012d1d;
          }
          .badge {
            background-color: #c1ecd4;
            color: #012d1d;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #012d1d;
          }
          .description {
            font-size: 14px;
            color: #414844;
            margin-bottom: 30px;
            line-height: 1.5;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid #c1c8c2;
            padding-bottom: 6px;
            margin-bottom: 15px;
            color: #6e5a4e;
            text-transform: uppercase;
            letter-spacing: 0.02em;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .field {
            display: flex;
            flex-direction: column;
          }
          .label {
            font-size: 12px;
            font-weight: 500;
            color: #717973;
            margin-bottom: 4px;
          }
          .value {
            font-size: 14px;
            font-weight: 600;
            color: #191c1d;
          }
          .value-mono {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            word-break: break-all;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px solid #c1c8c2;
            padding-top: 20px;
            font-size: 11px;
            color: #717973;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">BhoomiChain</div>
          <div class="badge">Legally Attested</div>
        </div>
        <div class="title">Certificate of Land Ownership</div>
        <div class="description">
          This document serves as cryptographic proof of land ownership registered on the Stellar blockchain network 
          and audited under the governance rules of BhoomiChain.
        </div>
        
        <div class="section">
          <div class="section-title">Parcel Registry Info</div>
          <div class="grid">
            <div class="field">
              <div class="label">Parcel Registry ID</div>
              <div class="value value-mono">#${parcel.id.toString()}</div>
            </div>
            <div class="field">
              <div class="label">Current Status</div>
              <div class="value">${parcel.status.toUpperCase()}</div>
            </div>
            <div class="field">
              <div class="label">Survey / Khasra Number</div>
              <div class="value">${parcel.surveyNumber}</div>
            </div>
            <div class="field">
              <div class="label">Total Area (Square Meters)</div>
              <div class="value">${parcel.areaSqm.toString()} sq m</div>
            </div>
            <div class="field">
              <div class="label">District</div>
              <div class="value">${parcel.district}</div>
            </div>
            <div class="field">
              <div class="label">State</div>
              <div class="value">${parcel.state}</div>
            </div>
            <div class="field">
              <div class="label">Geospatial Coordinates</div>
              <div class="value">Lat: ${(parcel.lat / 1_000_000).toFixed(6)}°, Lon: ${(parcel.lon / 1_000_000).toFixed(6)}°</div>
            </div>
            <div class="field">
              <div class="label">Registered Valuation</div>
              <div class="value">${(Number(parcel.priceXlm) / 10_000_000).toLocaleString('en-IN')} XLM</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Blockchain Provenance</div>
          <div class="grid">
            <div class="field" style="grid-column: span 2;">
              <div class="label">Registered Land Owner (Stellar Address)</div>
              <div class="value value-mono">${parcel.owner}</div>
            </div>
            <div class="field" style="grid-column: span 2;">
              <div class="label">Attesting Verifier Address</div>
              <div class="value value-mono">${parcel.verifier ?? 'Not Attested'}</div>
            </div>
            <div class="field">
              <div class="label">Attester Licensed Name</div>
              <div class="value">${verifierName}</div>
            </div>
            <div class="field">
              <div class="label">Signature Verification</div>
              <div class="value">Cryptographically Confirmed</div>
            </div>
          </div>
        </div>

        <div class="footer">
          BhoomiChain Registry Contract. Verified on Stellar Testnet. 
          Generative Timestamp: ${new Date().toLocaleString('en-IN')}
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
