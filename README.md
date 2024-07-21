
# Project Overview

This project includes a backend implemented with Flask and a frontend using Next.js. The backend exposes multiple APIs for managing Docker containers, volumes, and backups. The frontend, styled with Tailwind CSS, provides an interface to interact with these APIs.

## Requirements

- Python 3.x
- Node.js
- npm
- Docker

## Backend Setup

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Backend Server**:

   ```bash
   sudo ./start.sh
   ```

   This script will:
   - Start the Gunicorn server with 4 workers, binding to `0.0.0.0:5000`.
   - Navigate to the frontend directory and start the Next.js development server.
   - Trap SIGINT and SIGTERM to stop processes cleanly.

## Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ./frontend/dev
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

## API Endpoints

All API endpoints are prefixed with `/api`.

### Containers

- **List Containers**: `GET /api/containers`
- **Start Container**: `POST /api/containers/start`
- **Stop Container**: `POST /api/containers/stop`
- **Pause Container**: `POST /api/containers/pause`
- **Remove Container**: `DELETE /api/containers`

### Volumes

- **List Volumes**: `GET /api/volumes`
- **Create Volume**: `POST /api/volumes`
- **Remove Volume**: `DELETE /api/volumes`

### Networks

- **List Networks**: `GET /api/networks`
- **Create Network**: `POST /api/networks`
- **Remove Network**: `DELETE /api/networks`

### Compose

- **Up**: `POST /api/compose/up`
- **Down**: `POST /api/compose/down`

### Backup

- **Create Backup**: `POST /api/backup`
- **Restore Backup**: `POST /api/restore`
- **List Backups**: `GET /api/backups`
- **Delete Backup**: `DELETE /api/backups`

### Store

- **List Store Items**: `GET /api/store`
- **Add Store Item**: `POST /api/store`
- **Remove Store Item**: `DELETE /api/store`

## WebSocket Terminal

A WebSocket-based terminal interface is implemented where JavaScript sends commands to Python, which executes them and returns the output.


## Notes

- Ensure you have the necessary permissions to run the scripts.
- Adjust paths and configurations as per your environment.
- This project assumes you have Docker and its related components installed and properly configured.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
