# Ineisha Diagnostic Laboratory Website

Website for Ineisha Diagnostic Laboratory, hosted on Firebase.

## Features

- Static HTML website with booking form
- Firebase Cloud Functions for handling booking submissions
- Firestore database for storing bookings
- Custom domain: www.ineisha.com

## Setup

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## CI/CD

This repository uses GitHub Actions to automatically deploy to Firebase when changes are pushed to the `main` branch.

### Setup

1. Generate a Firebase CI token:
   ```bash
   firebase login:ci
   ```

2. Add the token to GitHub Secrets:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add a new secret named `FIREBASE_TOKEN` with the token from step 1

## Project Structure

- `public/` - Static HTML files served by Firebase Hosting
- `functions/` - Cloud Functions for handling form submissions
- `firestore.rules` - Firestore security rules
- `firebase.json` - Firebase configuration

## Deployment

Deployments happen automatically via GitHub Actions when code is pushed to `main`.

Manual deployment:
```bash
firebase deploy --only hosting,functions,firestore
```
