# GTR-Lens Backend

This directory contains the Django backend for the GTR-Lens application. It serves a RESTful API for the frontend client.

For a full overview of the project, please see the [root README](../README.md).

---

## Technology Stack
- **Framework**: [Django](https://www.djangoproject.com/)
- **API**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Authentication**: [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/) for token-based authentication.
- **Database**: [PostgreSQL](https://www.postgresql.org/) (configured via `dj-database-url`).
- **File Storage**: AWS S3 for media file uploads via `django-storages`.
- **Static Files**: WhiteNoise for serving static files in production.

## 🚀 Getting Started (Recommended: Docker)

This is the fastest and most reliable way to get a full development environment running, as it includes the web server and database in one command.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1\. Set up Environment Files

This project uses `.example` files as templates. You'll need to copy them to create your local configuration.

**In the `/backend` directory:**

Copy the local environment variables:

```bash
cp .env.example .env
```

Copy the local Docker database configuration:

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

### 2\. Build and Run Containers

This command will build the Django image, download the Postgres image, and start both services in the background.

```bash
docker compose up --build -d
```

- `--build` forces a fresh build of the Django app image.
- `-d` (detached) runs the containers in the background so you can continue to use your terminal.

### 3\. Run Database Migrations

This command tells the `web` container to run the `migrate` command, setting up your database tables.

```bash
docker compose exec web python manage.py migrate
```

### 4\. Create a Superuser

To log in to the Django admin panel, you must create an admin user.

```bash
docker compose exec web python manage.py createsuperuser
```

Follow the prompts to set your **username** and **password**.

**You're all set\!** The API is now running at `http://127.0.0.1:8000/`.

---

## Configuration

This project is configured using environment variables, loaded from `.env` files.

- **`.env.example`**: A template for local development. It's pre-configured to work with the Docker setup and provides credentials for _both_ the Django app and the Postgres container.
- **`.env`**: Your local (ignored) file. It's created when you copy `.env.example`.
- **`docker-compose.override.yml.example`**: A template that adds the `db` (Postgres) service to your local setup.
- **`docker-compose.override.yml`**: Your local (ignored) file that tells Docker to run a database alongside your web app.
- **`.env.prod.example`**: A template for production. It contains placeholders for production secrets like a real `DATABASE_URL` and `AWS_ACCESS_KEY_ID`.

---

## Running Locally Without Docker (Alternative Method)

Use this method if you are not using Docker and want to manage your own Python environment and database.

**Prerequisites:**

- Python (3.9 or newer)
- `pip`
- A running PostgreSQL database instance.

<!-- end list -->

1.  **Create and activate a virtual environment:**

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    # On Windows, use: venv\Scripts\activate
    ```

2.  **Install dependencies:**

    ```sh
    pip install -r requirements.txt
    ```

3.  **Configure environment:**
    Copy the _production_ template, as it's designed for an external database:

    ```sh
    cp .env.prod.example .env
    ```

    Now, **edit the `.env` file** to match your local PostgreSQL credentials and set `DEBUG="True"`.

4.  **Run migrations:**

    ```sh
    python src/manage.py migrate
    ```

5.  **Run the server:**

    ```sh
    python src/manage.py runserver
    ```

    The API will be available at `http://127.0.0.1:8000`.

---

## API Endpoints

The API is served under the `/api/` path.

- `/api/`: Main API routes, defined in `api.urls`.
- `/api/auth/`: Authentication endpoints (e.g., `/api/auth/login/`, `/api/auth/logout/`).
- `/admin/`: The Django admin interface. (Log in with the superuser you created).

Authentication is handled via tokens (`rest_framework.authentication.TokenAuthentication`).

## Deployment Notes

- **Static Files**: `WhiteNoise` is configured. Run `python manage.py collectstatic` before deploying.
- **Media Files**: Media files are stored on AWS S3. Ensure that the AWS credentials and bucket name are correctly set in the production environment (using `.env.prod.example` as a template).
- **Security**: In production, `DEBUG` must be set to `False`. The `SECURE_PROXY_SSL_HEADER` is configured, which is important when running behind a reverse proxy like Nginx.
- **Nginx:** For production deployments using Nginx as a reverse proxy, see the `nginx.example.conf` file for a working template. You will need to update the paths and domain names to match your server.
