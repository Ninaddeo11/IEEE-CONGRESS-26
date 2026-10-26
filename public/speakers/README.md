# Speaker photos

Drop speaker headshots in this folder and wire them up in `data/congress.js`:

1. Save the photo here, e.g. `public/speakers/praveen-shukla.jpg`
   (square or landscape crop works — images are `object-fit: cover`)
2. In `data/congress.js`, set the matching speaker's `photo` field:

```js
{ name: 'Mr. Praveen Shukla', photo: '/speakers/praveen-shukla.jpg', ... }
```

While `photo` is `null`, the card automatically shows the styled initials fallback.

Tip: keep each file under ~200 KB (1200×900 px is plenty) so the page stays fast.
