# Diwali — The Return to Ayodhya 🪔

A free, browser-based 3D Diwali experience inspired by the Ramayana and the traditional celebration of Shri Ram's return to Ayodhya.

## Run locally
Because the project uses JavaScript modules, serve the folder through a local web server (not by opening the HTML file directly).

For example, with Python installed:
```bash
python -m http.server 8000
```
Then open http://localhost:8000.

## Controls
- Click **Enter the City** to begin.
- Desktop: click the 3D view and use WASD to walk; move the mouse to look around; press Escape to release the mouse.
- Mobile: drag on the scene to look around.
- Use the sound control to enable a subtle generated ambient tone.

## Free hosting with GitHub Pages
1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main** and **/(root)**, then Save.
4. Wait for GitHub Pages to publish the site.

No paid APIs or assets are required. Three.js is loaded from jsDelivr; Google Fonts are an optional external font enhancement. The 3D scene itself is generated in code.
