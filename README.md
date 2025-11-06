#  <img src=frontend/public/gtr_logo.svg width="96"> GTR-Lens

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Django REST](https://img.shields.io/badge/Django%20REST-A30000?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=FF9900)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

A full-stack web application designed for Grover Tool & Rentals to track the before-and-after condition of rental equipment. This tool helps to streamline the check-in/check-out process, minimize customer disputes, and maintain a visual history of asset conditions.

## Project Structure

The project is a monorepo containing the frontend and backend applications.

- **/frontend**: Contains the React client-side application built with Vite. See the [frontend README](./frontend/README.md) for more details.
- **/backend**: Contains the Django server-side application. See the [backend README](./backend/README.md) for more details.

## Technology Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Django, Django REST Framework, dj-rest-auth, Whitenoise
- **Database**: PostgreSQL
- **Infrastructure**: Docker, AWS S3 for media storage

---

## Getting Started (Recommended)

Follow these instructions to get the full application (frontend and backend) running on your local machine.

The **recommended** method uses Docker Compose to run the backend and database, and `npm` to run the frontend development server.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/)

---

## Running the Application (Recommended)

You will need two separate terminals for this.

### Terminal 1: Start the Backend (Docker)

1.  Navigate to the backend directory:
    ```sh
    cd backend
    ```
2.  Follow the setup instructions in the [backend README's "Getting Started"](./backend/README.md#-getting-started-recommended-docker) section. This involves:
    - Copying `.env.example` to `.env`.
    - Copying `docker-compose.override.yml.example` to `docker-compose.override.yml`.
    - Running `docker compose up --build -d`.
    - Running `docker compose exec web python manage.py migrate`.
    - Running `docker compose exec web python manage.py createsuperuser`.

Once complete, the **backend API** will be running at `http://127.0.0.1:8000`.

### Terminal 2: Start the Frontend (Node)

1.  Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run dev
    ```

The **frontend application** will be running at `http://localhost:5173` and will be connected to your backend.

---

## Running Manually (Alternative)

If you do not want to use Docker, you can run both services manually. See the "Running Locally Without Docker" section in the backend README and the "Running the Development Server" section in the frontend README.

## Deployment (Production)

This project is intended to be deployed with the frontend and backend on the same domain, using a reverse proxy (like Nginx) to route traffic.

1.  **Backend:** The Django application is served by a WSGI server (like Gunicorn) and handles all requests to `/api/` and `/admin/`. It also serves static admin files via WhiteNoise.
2.  **Frontend:** The React app is built using `VITE_API_URL=/api/ npm run build`. The resulting static files (HTML, CSS, JS) are served by the reverse proxy for all other routes.
3.  **Proxy Configuration:** The reverse proxy is configured to:
    - Serve static frontend files from the `frontend/dist` directory for the `/` route.
    - Forward all requests for `/api/` to the backend Gunicorn server.
    - Forward all requests for `/admin/` to the backend Gunicorn server.
    - (Optional) Serve media files from `/media/` (if not using S3 in production).

## Contributing

Contributions are welcome\! Please feel free to open an issue or submit a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.
