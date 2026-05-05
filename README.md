# Smart Core Solutions Website

Static website for Smart Core Solutions, an IoT service business focused on GPS fleet tracking and smart monitoring for facilities, energy use, occupancy, air quality, and vibration alerts.

## Project Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
├── Clients Logos/
└── service and field photos
```

## Run Locally

This site does not need a build step. You can open `index.html` directly or run a small static server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Contact Form

The form currently falls back to opening an email draft because the Formspree action still uses `YOUR_FORM_ID`.

To connect it:

1. Create a Formspree form.
2. Replace `https://formspree.io/f/YOUR_FORM_ID` in `index.html`.
3. Update the contact email if the new domain uses a different address.

## Deployment

The site is ready for GitHub Pages or any static host. For GitHub Pages, publish the repository from the `main` branch and set Pages to deploy from the repository root.
