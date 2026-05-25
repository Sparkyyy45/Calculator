# Calculator

A minimal, modern calculator built with React + Vite. Clean, Apple-like UI with keyboard support and copy-to-clipboard for results.

## Demo

Run locally (development):

```bash
npm install
npm run dev
# open http://localhost:5173/
```

Build for production:

```bash
npm run build
npm run preview
```

## Features

- Modern, minimal UI inspired by macOS/iOS design.
- Keyboard support (digits, `+ - * /`, `Enter` to evaluate, `Backspace` to delete, `Escape` to clear).
- Click or press Enter on the result to copy it to the clipboard (small tooltip feedback).
- Responsive layout for small screens.

## File Structure

- `index.html` — app entry
- `src/main.jsx` — React bootstrap
- `src/App.jsx` — calculator UI and logic
- `src/App.css`, `src/index.css` — styles

## Contributing

Feel free to open issues or PRs. For quick improvements, consider:

- Adding dark mode toggle
- Persisting history to `localStorage`
- Deploying to GitHub Pages or Netlify

## License

MIT
