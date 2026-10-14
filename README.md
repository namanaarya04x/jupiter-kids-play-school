# Jupiter Kids Play School website

Plain HTML, CSS and JavaScript. No build step, no framework.

```
index.html   the page (all sections and Hindi/English text)
style.css    all styling, light and dark colours at the top
main.js      menu, language toggle, counters, enquiry form
logo.jpg     school logo (also the browser tab icon)
```
Keep all four files in the same folder.

## Open it
Double-click `index.html`. Fonts load from Google Fonts, so it needs internet for the correct look.

## Put it online (free)
Upload the whole folder to Netlify (drag and drop), Vercel, GitHub Pages or Cloudflare Pages.

## Things you will want to edit
- **Phone, address, email, timings:** search `index.html` for `88825`, `Green Park`, `jupiterkidsplayschool@gmail.com`, `8:00 AM`.
- **WhatsApp button number:** search `918882529337` (the floating button near the end of `index.html`).
- **Google Maps button:** search `maps.app.goo.gl`.
- **Gallery photos:** the four tiles (Dance, Sports, Photos, Art & Craft) are colour placeholders. Replace a tile's contents with an `<img src="your-photo.jpg" alt="...">` and give `.tile` an `overflow:hidden` image (`object-fit:cover; width:100%; height:100%`).
- **Colours:** the variables at the top of `style.css` (`--accent`, `--navy`, `--gold` ...).
- **Hindi text:** every translatable element has a `data-hi="..."` attribute next to its English text.

## Admission enquiry form: how the email works
By default the form validates the entry, then shows the details with three buttons: **Open in Gmail** (compose window addressed to jupiterkidsplayschool@gmail.com), **Other email app**, and **Copy details**. The parent must press Send in their email app, so nothing arrives on its own.

To receive every enquiry in the inbox automatically:
1. Create a free form at https://formspree.io and set it to deliver to jupiterkidsplayschool@gmail.com.
2. Copy the form URL (looks like `https://formspree.io/f/xxxxxxxx`).
3. Paste it into `FORM_ENDPOINT` at the top of `main.js`.
4. Publish the site on a real host (step above). Formspree works from the live site, not from a double-clicked local file.

The Gmail and copy buttons stay available as a backup.
