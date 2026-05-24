# Krelixir API Documentation

Base URL: `https://api.krelixir.ai` (or `http://localhost:5000` in development)

All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication

### Register
`POST /api/auth/register`
```json
// Request
{ "name": "John Smith", "email": "john@company.com", "password": "SecurePass123" }

// Response 201
{ "success": true, "user": { "id": "...", "name": "John Smith", "email": "..." }, "token": "eyJ..." }
```

### Login
`POST /api/auth/login`
```json
// Request
{ "email": "demo@krelixir.ai", "password": "demo1234" }

// Response 200
{ "success": true, "user": {...}, "token": "eyJ..." }
```

### Get Current User
`GET /api/auth/me` 🔒
```json
// Response
{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "admin" } }
```

---

## Dashboard

### Get Statistics
`GET /api/dashboard/stats` 🔒
```json
// Response
{
  "success": true,
  "stats": {
    "totalAssets": 23,
    "migrated": 4,
    "migrating": 2,
    "pending": 17,
    "totalCurrentCost": 34650,
    "totalProjectedCost": 12480,
    "totalSavings": 22170,
    "savingsPercent": 64,
    "migrationReadiness": 72,
    "riskScore": "Medium",
    "criticalIssues": 2
  }
}
```

### Get Activity Feed
`GET /api/dashboard/activity` 🔒

### Get Cost Comparison
`GET /api/dashboard/cost-comparison` 🔒

---

## Inventory

### List All Assets
`GET /api/inventory` 🔒
- Query params: `type`, `status`, `search`

### List By Type
- `GET /api/inventory/servers` 🔒
- `GET /api/inventory/databases` 🔒
- `GET /api/inventory/applications` 🔒
- `GET /api/inventory/network` 🔒

### Add Asset
`POST /api/inventory` 🔒
```json
{
  "name": "my-server",
  "type": "Server",
  "os": "Ubuntu 22.04",
  "cpu": 8,
  "ram": 32,
  "storage": 500,
  "status": "active",
  "region": "On-Prem / US-East",
  "cost": 1200
}
```

### Update Asset
`PUT /api/inventory/:id` 🔒

### Delete Asset
`DELETE /api/inventory/:id` 🔒

### Upload CSV
`POST /api/inventory/upload` 🔒
- Content-Type: `multipart/form-data`
- Field: `file` (CSV with columns: name, type, os, cpu, ram, storage, status, region, cost)

---

## Recommendations

### Get All Recommendations
`GET /api/recommendations` 🔒
```json
// Response
{
  "success": true,
  "recommendations": [...],
  "totalSavings": 22170,
  "count": 19
}
```

### Trigger Analysis
`POST /api/recommendations/analyze` 🔒

### Get Single Recommendation
`GET /api/recommendations/:assetId` 🔒

---

## AI Chat

### Send Message
`POST /api/ai/chat` 🔒
```json
// Request
{ "message": "What are my top 3 cost optimization opportunities?" }

// Response
{
  "success": true,
  "message": "## Top Cost Optimization Opportunities\n\n...",
  "timestamp": "2025-05-24T..."
}
```

### Get Chat History
`GET /api/ai/history` 🔒

### Clear History
`DELETE /api/ai/history` 🔒

---

## CSV Import Format

```csv
name,type,os,engine,stack,cpu,ram,storage,status,region,cost,migration_status
web-server-01,Server,Ubuntu 22.04,,, 8,32,500,active,On-Prem / US-East,1800,pending
prod-db,Database,,MySQL 8.0,,,,, active,On-Prem / US-East,2200,pending
```

---

## Error Responses

```json
// 400 Bad Request
{ "success": false, "message": "Validation error", "errors": [...] }

// 401 Unauthorized
{ "success": false, "message": "No token provided" }

// 404 Not Found
{ "success": false, "message": "Asset not found" }

// 429 Rate Limited
{ "success": false, "message": "Too many requests. Please try again later." }

// 500 Server Error
{ "success": false, "message": "Internal server error" }
```
