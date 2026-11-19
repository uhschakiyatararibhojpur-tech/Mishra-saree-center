MISHRA SAREE CENTER WEBSITE
============================

1. Open index.html in a browser to preview.
2. Upload the complete folder to your hosting (GitHub Pages, Netlify, etc.).
3. Owner product management:
   - Open website and click "Owner Admin" in footer.
   - Add name, price, category, description and photo.
   - Products are saved in browser localStorage on that device.
   - Export products JSON for backup.

IMPORTANT FOR LIVE WEBSITE:
The included Owner Admin is a local demo. To make products sync between all customer devices, connect Google Apps Script + Google Sheet + image storage.

Google Apps Script connection:
- Open app.js
- Set API_URL to your deployed Web App URL.
- Implement GET endpoint to return product list.
- Implement POST endpoint for add/update/delete products.
- Use Google Drive or another image hosting service for image URLs. Do not store large image data in Google Sheets.

Replace:
- WhatsApp number 919999999999 in index.html and app.js with shop owner's number (country code included, no +).
- Shop address and phone in footer.
- Google Maps link in footer.
- Demo product images and prices with actual shop products.

Files:
index.html = website structure
style.css = design and responsive layout
app.js = products, filters, cart, owner manager


BILINGUAL WEBSITE:
Use the English / Hindi language button in the header to switch languages. The language preference is saved on the visitor's browser.
