# XMotor Industrial OPS - Control Backend

FastAPI backend for simulating Control page data flow in an industrial polishing system.

## Features

- ✅ **Virtual Data Generator**: Automatically generates mock sensor data every 2 seconds
- ✅ **Real-time API**: GET `/api/control/latest` to fetch latest motor & vibration data
- ✅ **Control Commands**: POST `/api/control/set-parameters` to send control commands (prints to terminal)
- ✅ **Thread-safe**: In-memory data storage with thread-safe locks
- ✅ **Logging**: Rotating file logs for all operations

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running the Server

```bash
# From the backend directory
uvicorn app.main:app --reload --port 8000

# Or from project root
uvicorn app.main:app --reload --port 8000 --app-dir backend
```

The server will start at: `http://127.0.0.1:8000`

## API Endpoints

### GET `/api/control/latest`
Returns the latest mock motor status and vibration metrics.

**Response:**
```json
{
  "motor_status": {
    "rpm": 4832.5,
    "torque": 1.31,
    "load": 72.5,
    "temperature": 41.2
  },
  "vibration_metrics": {
    "main_freq": 254.3,
    "amplitude": 0.33,
    "rms": 0.14,
    "impulse_count": 5
  },
  "timestamp": "2025-11-10T15:24:12Z"
}
```

### POST `/api/control/set-parameters`
Sends control commands from frontend. Prints to terminal.

**Request:**
```json
{
  "mode": "torque",
  "target_rpm": 5000,
  "target_torque": 1.5
}
```

**Terminal Output:**
```
[CONTROL COMMAND] Mode=torque | Target RPM=5000 | Target Torque=1.5
```

**Response:**
```json
{
  "status": "received",
  "message": "Control parameters logged",
  "mode": "torque",
  "applied_values": {
    "rpm": null,
    "torque": 1.5
  }
}
```

### POST `/api/control/motor-status` (Optional)
Manually update motor status (mock generator handles this automatically).

### POST `/api/control/vibration-metrics` (Optional)
Manually update vibration metrics (mock generator handles this automatically).

## Mock Data Generation

The backend automatically generates virtual sensor data every 2 seconds:

- **Motor Status**: RPM (4000-5200), Torque (1.0-1.6), Load (60-85%), Temperature (35-48°C)
- **Vibration Metrics**: Main Frequency (200-300 Hz), Amplitude (0.2-0.4), RMS (0.1-0.25), Impulse Count (2-8)

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://127.0.0.1:8000/api/docs
- **OpenAPI JSON**: http://127.0.0.1:8000/api/openapi.json

## Testing

Use the `EXAMPLES.http` file with REST Client extension, or use curl:

```bash
# Get latest data
curl http://127.0.0.1:8000/api/control/latest

# Send control command
curl -X POST http://127.0.0.1:8000/api/control/set-parameters \
  -H "Content-Type: application/json" \
  -d '{"mode":"torque","target_torque":1.5}'
```

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app with startup event
│   ├── routers/
│   │   └── control.py          # API endpoints
│   ├── schemas/
│   │   └── motor_schemas.py    # Pydantic models
│   ├── services/
│   │   ├── control_service.py  # Data storage & business logic
│   │   └── mock_data_service.py # Background data generator
│   ├── core/
│   │   └── config.py           # Settings
│   └── utils/
│       └── logger.py           # Logging setup
├── requirements.txt
└── EXAMPLES.http
```

