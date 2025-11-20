# UIproj

This repository contains the UI project and backend for the product.

Contents
- backend/: Python backend and services
- my-ui-vite/: frontend Vite app
- public/ and src/: app sources

How to push to GitHub

1) Create an empty repository on GitHub via the website or use the GitHub CLI:

   gh repo create <owner>/<repo> --public --source=. --remote=origin

2) If you created the repo manually, add the remote and push:

   git remote add origin https://github.com/<owner>/<repo>.git
   git branch -M main
   git push -u origin main

If you don't have the GitHub CLI, create the repo on the web UI, then run the remote add and push commands above.

Notes
- Configure your local git user (only for this repository) before committing:

   git config user.name "Your Name"
   git config user.email "you@example.com"

- Replace <owner>/<repo> and the URL with your GitHub account and repository name.
