# GPS Tracker Backend

Backend service designed to run a TCP Server that listens to hardware GPS trackers and an HTTP API for querying devices and their positions. Built with **Node.js**, **Express**, and **MySQL**.

## Features

- **TCP Server**: Listens on a configured port for incoming GPS data from hardware tracking devices and dumps it into the MySQL database.
- **REST APIs**: Provides endpoints to manage registered trackers, fetch the last known locations of all devices, and retrieve historical route data of a specific tracker.

## Prerequisites

- Node.js (v14+ recommended)
- MySQL Server (v5.7+)

## Setup

1. **Clone/Download** the repository.
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Configure Environment Variables**: Create a `.env` file in the root of your project or configure based on this example mapping:

   ```env
   PORT=4444
   
   DB_HOST=localhost
   DB_USER=gps
   DB_PASS=gps
   DB_NAME=gps
   
   TCP_PORT=5023
   ```

## Database Schema (Required Tables)

Ensure your database `gps` (or as configured) has the following basic structure:

### `devices`
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `imei` (VARCHAR, Unique)

### `positions`
- `id` (Primary Key, Auto Increment)
- `device_id` (Foreign Key -> devices.id)
- `latitude` (DECIMAL or FLOAT)
- `longitude` (DECIMAL or FLOAT)
- `speed` (FLOAT)
- `course` (FLOAT)
- `device_time` (DATETIME)

## Running the Service

Start the server using `node`:
```sh
node app.js
```

This will run:
- The Express HTTP API on the configured `PORT` (default 4444).
- The TCP Server on the configured `TCP_PORT` (default 5023).

---

## API Documentation

### 1. `GET /api/devices`
Fetches a list of all registered GPS trackers.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Vehicle A",
    "imei": "123456789012345"
  }
]
```

### 2. `POST /api/devices`
Registers a new device to track.

**Body (JSON)**:
```json
{
  "name": "Vehicle B",
  "imei": "987654321098765"
}
```
**Response**:
```json
{
  "message": "Device registered"
}
```

### 3. `GET /api/positions/latest`
Gets the most recent recorded position for all known and previously connected trackers.

**Response**:
```json
[
  {
    "imei": "123456789012345",
    "name": "Vehicle A",
    "latitude": -6.200000,
    "longitude": 106.816666,
    "speed": 40.5,
    "course": 90.0,
    "device_time": "2023-11-20T10:00:00.000Z"
  }
]
```

### 4. `GET /api/positions/:imei/history`
Provides the historical location records for a specific GPS tracker by its IMEI. Returns the data ordered sequentially by the most recent paths first.

**Path Parameters**:
- `imei` - The IMEI of the device (Example: `123456789012345`)

**Response**:
```json
[
  {
    "latitude": -6.200000,
    "longitude": 106.816666,
    "speed": 40.5,
    "course": 90.0,
    "device_time": "2023-11-20T10:00:00.000Z"
  },
  {
    "latitude": -6.200500,
    "longitude": 106.816000,
    "speed": 38.0,
    "course": 90.0,
    "device_time": "2023-11-20T09:59:00.000Z"
  }
]
```
