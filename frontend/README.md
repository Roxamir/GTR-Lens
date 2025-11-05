# GTR-Lens Frontend

This directory contains the frontend code for the GTR-Lens application, built with React and Vite.

For a full overview of the project, please see the [root README](../README.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (or another package manager)

### Installation

1.  Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```

### Running the Development Server

To start the Vite development server with Hot Module Replacement (HMR):

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (by default).

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Bundles the app for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Serves the production build locally for previewing.

## Building for Production

When building the app for a production environment, you must provide the `VITE_API_URL` environment variable.

This variable tells the frontend where to send its API requests. For a deployment where the frontend and backend are served from the same domain (e.g., behind a reverse proxy), you'll set the URL to a relative path:

```sh
VITE_API_URL=/api/ npm run build
```

If your backend is hosted on a separate domain, you would use the full URL:

```sh
VITE_API_URL=https://api.your-domain.com/ npm run build
```
