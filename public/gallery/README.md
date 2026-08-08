Drop photos in here (`.jpg`, `.png`, `.webp`), then point
`site.config.ts → gallery.tiles[n].src` at `/gallery/your-file.jpg`.

Frames are 4:5 in the filmstrip layout, so portrait crops look best. Anything
left as `src: null` renders as a numbered placeholder frame.
