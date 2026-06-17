<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f443c2b0-389e-4c4c-8c90-09649c67c9fd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Add your Gemini API key (securely):

   - Create a file named `.env.local` at the project root (this file is ignored by git).
   - Add your key there using the same name as the example, e.g.:

     GEMINI_API_KEY=your_real_gemini_api_key_here

   - Important: do NOT commit `.env.local` to source control. The repository already ignores `.env*`.

3. (Optional) If you debug in VS Code the workspace is configured to load `.env.local` automatically. See `.vscode/launch.json`.

4. Run the app:

   `npm run dev`
