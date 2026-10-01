# WB Leads Application - API Documentation

> **Base URL**: `http://localhost:3001/api` (Development) | `/api` (Production with Nginx)  
> **Generated**: January 23, 2026

---

## Table of Contents

1. [Health & System](#1-health--system)
2. [Authentication](#2-authentication)
3. [Dashboard](#3-dashboard)
4. [Leads Management](#4-leads-management)
5. [Accounts Management](#5-accounts-management)
6. [Account Contacts](#6-account-contacts)
7. [Account Line of Business](#7-account-line-of-business)
8. [Account Departments](#8-account-departments)
9. [Account Use Cases](#9-account-use-cases)
10. [Department Pain Points](#10-department-pain-points)
11. [Telecall Logs](#11-telecall-logs)
12. [Meetings](#12-meetings)
13. [User Management](#13-user-management)
14. [Master Data Management](#14-master-data-management)
15. [Dropdown/Reference Data](#15-dropdownreference-data)
16. [Import/Webhooks](#16-importwebhooks)

---

## 1. Health & System

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-23T10:00:00.000Z"
}
```

---

## 2. Authentication

### Login
```
POST /api/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "user@example.com",
    "role": "Admin",
    "status": "Active"
  }
}
```

### Debug Password Reset (Development Only)
```
GET /api/debug-reset
```
Resets admin password to default.

---

## 3. Dashboard

### Get Dashboard Stats
```
GET /api/dashboard
```
**Response:**
```json
{
  "totalLeads": 150,
  "totalAccounts": 80,
  "totalRevenue": 500000,
  "expectedPipeline": 250000,
  "todayFollowups": 5,
  "leadsByStage": [
    { "name": "Lead Sourcing", "count": 30 },
    { "name": "Qualification", "count": 25 }
  ],
  "recentLeads": [...],
  "callsToday": 45,
  "outcomes": {
    "noAnswer": 10,
    "busy": 5,
    "callback": 8,
    "interested": 12,
    "notInterested": 5,
    "wrongNumber": 2,
    "askToWhatsapp": 3
  }
}
```

### Get User Lead Stats
```
GET /api/dashboard/user-stats
```
Returns lead and call statistics grouped by user for today, yesterday, this week, and this month.

---

## 4. Leads Management

### Get All Leads
```
GET /api/leads
```
Returns all leads with joined account, user, stage, and status details.

### Get Single Lead
```
GET /api/leads/:id
```
**Parameters:** `id` - Lead ID

### Create Lead
```
POST /api/leads
```
**Request Body:**
```json
{
  "account_name": "ABC Corp",          // Required
  "company_website": "https://abc.com", // Required
  "industry": "Technology",
  "head_office": "Mumbai",
  "location": "Maharashtra",
  "primary_contact_name": "John Doe",
  "contact_person_role": "Manager",
  "contact_phone": "9876543210",
  "contact_email": "john@abc.com",
  "company_phone": "022-12345678",
  "lead_source": "Website",
  "lead_generated_by": 1,
  "stage_id": 1,
  "status_id": 1,
  "call_status": "New"
}
```

### Update Lead
```
PUT /api/leads/:id
```
**Parameters:** `id` - Lead ID  
**Request Body:** Same as Create Lead (all fields optional)

### Delete Lead
```
DELETE /api/leads/:id
```
**Parameters:** `id` - Lead ID

### Update Lead Stage/Status
```
PATCH /api/leads/:id/stage
```
**Request Body:**
```json
{
  "stage_id": 2,
  "status_id": 3
}
```

### Bulk Update Lead Stages
```
PATCH /api/leads/bulk-stage
```
**Request Body:**
```json
{
  "lead_ids": [1, 2, 3, 4, 5],
  "stage_id": 2,
  "status_id": 3
}
```

### Update Lead DE Assignment
```
PATCH /api/leads/:id/de-assignment
```
**Request Body:**
```json
{
  "de_assigned_to": 5
}
```

### Get Lead Stats
```
GET /api/leads/stats
```
**Query Parameters:** `stage_ids` (optional, comma-separated)  
**Response:**
```json
{
  "today": 10,
  "yesterday": 8,
  "thisWeek": 45,
  "thisMonth": 120,
  "callsToday": 25,
  "outcomes": {...}
}
```

### Get Follow-ups
```
GET /api/leads/followups
```
**Query Parameters:** `date` (optional, format: YYYY-MM-DD)  
Returns follow-ups scheduled for the specified date (defaults to today).

---

## 5. Accounts Management

### Get All Accounts
```
GET /api/accounts
```
Returns all accounts with latest lead stage information.

### Get Account (Dropdown List)
```
GET /api/leads/accounts
```
Returns minimal account data (id and name) for dropdowns.

### Get Full Account Details
```
GET /api/accounts/:id/full
```
**Parameters:** `id` - Account ID  
Returns account with all related data: contacts, line of business, departments, use cases, and pain points.

### Create Account
```
POST /api/accounts
```
**Request Body:**
```json
{
  "account_name": "XYZ Corp",
  "industry": "Manufacturing",
  "head_office": "Delhi",
  "location": "North India",
  "primary_contact_name": "Jane Doe",
  "contact_person_role": "Director",
  "contact_phone": "9876543210",
  "contact_email": "jane@xyz.com",
  "company_phone": "011-12345678",
  "account_status": "Prospect",
  "account_owner": "Sales Team",
  "remarks": "High potential client"
}
```

### Update Account
```
PUT /api/accounts/:id
```
**Parameters:** `id` - Account ID  
**Request Body:** (all fields optional)
```json
{
  "account_name": "XYZ Corp",
  "industry": "Manufacturing",
  "head_office": "Delhi",
  "country": "India",
  "primary_lob": "Insurance",
  "company_website": "https://xyz.com",
  "company_phone": "011-12345678",
  "employee_count": 500,
  "total_revenue": 10000000,
  "lead_source": "Referral",
  "remarks": "Updated notes"
}
```
> **Note:** Data completion score is automatically calculated on update.

### Delete Account
```
DELETE /api/accounts/:id
```
**Parameters:** `id` - Account ID  
> Cannot delete accounts with existing leads.

### Check Duplicate Account
```
GET /api/accounts/check-duplicate
```
**Query Parameters:**
- `account_name` - Account name to check
- `company_website` - Website URL to check
- `exclude_account_id` - Account ID to exclude from check

**Response:**
```json
{
  "account_name_exists": false,
  "company_website_exists": true,
  "existing_account_name": null,
  "existing_website_account": "ABC Corp"
}
```

### Recalculate All Data Completion Scores
```
POST /api/accounts/recalculate-scores
```
Recalculates data completion scores for all accounts.

---

## 6. Account Contacts

### Get Account Contacts
```
GET /api/accounts/:id/contacts
```

### Create Contact
```
POST /api/accounts/:id/contacts
```
**Request Body:**
```json
{
  "name": "John Smith",
  "role": "IT Manager",
  "phone": "9876543210",
  "email": "john.smith@company.com"
}
```

### Update Contact
```
PUT /api/accounts/:accountId/contacts/:contactId
```

### Delete Contact
```
DELETE /api/accounts/:accountId/contacts/:contactId
```

---

## 7. Account Line of Business

### Get Line of Business
```
GET /api/accounts/:id/line-of-business
```

### Create Line of Business
```
POST /api/accounts/:id/line-of-business
```
**Request Body:**
```json
{
  "business_type": "Motor Insurance",
  "description": "Private and commercial vehicle insurance"
}
```

### Update Line of Business
```
PUT /api/accounts/:accountId/line-of-business/:lobId
```

### Delete Line of Business
```
DELETE /api/accounts/:accountId/line-of-business/:lobId
```

---

## 8. Account Departments

### Get Departments
```
GET /api/accounts/:id/departments
```

### Create Department
```
POST /api/accounts/:id/departments
```
**Request Body:**
```json
{
  "department_name": "IT",
  "head_name": "John Doe"
}
```

### Update Department
```
PUT /api/accounts/:accountId/departments/:deptId
```

### Delete Department
```
DELETE /api/accounts/:accountId/departments/:deptId
```
> Also deletes related pain points.

---

## 9. Account Use Cases

### Get Use Cases
```
GET /api/accounts/:id/use-cases
```

### Create Use Case
```
POST /api/accounts/:id/use-cases
```
**Request Body:**
```json
{
  "use_case_title": "Claims Automation",
  "description": "Automate claims processing workflow",
  "status": "Identified"
}
```
**Status Options:** `Identified`, `In Progress`, `Completed`

### Update Use Case
```
PUT /api/accounts/:accountId/use-cases/:ucId
```

### Delete Use Case
```
DELETE /api/accounts/:accountId/use-cases/:ucId
```

---

## 10. Department Pain Points

### Get Pain Points
```
GET /api/departments/:deptId/pain-points
```

### Create Pain Point
```
POST /api/departments/:deptId/pain-points
```
**Request Body:**
```json
{
  "pain_point": "Manual data entry",
  "severity": "High",
  "notes": "Spending 4+ hours daily on manual entry"
}
```
**Severity Options:** `Low`, `Medium`, `High`

### Update Pain Point
```
PUT /api/departments/:deptId/pain-points/:ppId
```

### Delete Pain Point
```
DELETE /api/departments/:deptId/pain-points/:ppId
```

---

## 11. Telecall Logs

### Log a Call
```
POST /api/calls
```
**Request Body:**
```json
{
  "lead_id": 1,
  "account_id": 1,
  "telecaller_user_id": 2,
  "call_outcome": "Interested",
  "notes": "Client requested demo next week",
  "followup_required": true,
  "followup_datetime": "2026-01-25T10:00:00"
}
```
**Call Outcome Options:** `No Answer`, `Busy`, `Call Back Later`, `Interested`, `Not Interested`, `Wrong Number`, `Ask to WhatsApp`

### Create Lead Call Log (Alternative)
```
POST /api/lead-call-logs
```
**Request Body:**
```json
{
  "lead_id": 1,
  "account_id": 1,
  "telecaller_user_id": 2,
  "call_outcome": "Interested",
  "notes": "Demo scheduled",
  "followup_required": true,
  "followup_datetime": "2026-01-25T10:00:00",
  "call_duration_seconds": 180,
  "stage_id": 2
}
```

### Get Lead Call History
```
GET /api/leads/:id/calls
```

### Get Lead Call Logs
```
GET /api/leads/:id/call-logs
```

### Get Account Call Logs
```
GET /api/accounts/:id/call-logs
```

---

## 12. Meetings

### Create Meeting
```
POST /api/meetings
```
**Request Body:**
```json
{
  "lead_id": 1,
  "account_id": 1,
  "meeting_type": "Initial Connect",
  "meeting_mode": "Online",
  "meeting_date": "2026-01-25",
  "meeting_time": "10:00",
  "meeting_city": 1,
  "meeting_address": "Conference Room A",
  "internal_attendees": "John, Jane",
  "customer_attendees": "Client CEO, CTO",
  "meeting_notes": "Product demo scheduled",
  "meeting_status": "Scheduled"
}
```
**Meeting Mode:** `Online`, `In-Person`  
**Meeting Status:** `Scheduled`, `Completed`, `Cancelled`

### Get All Meetings
```
GET /api/meetings
```

### Get Lead Meetings
```
GET /api/leads/:id/meetings
```

### Update Meeting Status
```
PATCH /api/meetings/:id/status
```
**Request Body:**
```json
{
  "status": "Completed"
}
```

### Reschedule Meeting
```
PATCH /api/meetings/:id/reschedule
```
**Request Body:**
```json
{
  "meeting_date": "2026-01-28",
  "meeting_time": "14:00"
}
```

### Get Meeting Stats
```
GET /api/meetings/stats
```
**Response:**
```json
{
  "today": 3,
  "yesterday": 2,
  "thisWeek": 15,
  "thisMonth": 45
}
```

---

## 13. User Management

### Get Users
```
GET /api/leads/users
```
Returns active users for dropdowns.

### Create User
```
POST /api/users
```
**Request Body:**
```json
{
  "full_name": "New User",
  "email": "newuser@company.com",
  "password": "password123",
  "role": "Sales",
  "phone": "9876543210",
  "status": "Active"
}
```
**Role Options:** `Admin`, `Manager`, `Sales`, `Telecaller`, `Intern`

### Update User
```
PUT /api/users/:id
```

### Delete User
```
DELETE /api/users/:id
```

---

## 14. Master Data Management

All master tables support generic CRUD operations:

### Supported Master Tables
| Table Name | Primary Key | Label Field |
|------------|-------------|-------------|
| `industry_master` | industry_id | industry_name |
| `lead_source_master` | lead_source_id | lead_source_name |
| `city_master` | city_id | city_name |
| `country_master` | country_id | country_name |
| `department_master` | department_master_id | department_name |
| `product_master` | product_id | product_name |
| `lob_use_case_master` | use_case_id | use_case_name |
| `industry_line_of_business` | lob_id | lob_name |
| `lead_stages` | stage_id | stage_name |
| `users` | user_id | full_name |

### Get Master Table Data
```
GET /api/master/:table
```
**Example:** `GET /api/master/industry_master`

### Add Record to Master Table
```
POST /api/master/:table
```
**Example:**
```json
POST /api/master/industry_master
{
  "industry_name": "Healthcare"
}
```

### Update Master Table Record
```
PATCH /api/master/:table/:id
```

### Delete Master Table Record
```
DELETE /api/master/:table/:id
```

---

## 15. Dropdown/Reference Data

### Get Industries
```
GET /api/leads/industries
```

### Get Lead Sources
```
GET /api/leads/lead-sources
```

### Get Cities
```
GET /api/leads/cities
```

### Get Countries
```
GET /api/leads/countries
```

### Get Industry LOBs (Line of Business)
```
GET /api/leads/industry-lobs
```

### Get Departments Master
```
GET /api/leads/departments-master
```

### Get Products Master
```
GET /api/leads/products-master
```

### Get Use Cases Master
```
GET /api/leads/use-cases-master
```

### Get Stages
```
GET /api/leads/stages
```

### Get Statuses
```
GET /api/leads/statuses
```
Returns statuses with their associated `stage_id`.

---

## 16. Import/Webhooks

### Import Leads from CSV
```
POST /api/leads/import-csv
```
**Request Body:** Array of lead objects
```json
[
  {
    "Account Name": "Company A",
    "Head Office": "Mumbai",
    "Industry": "Technology",
    "Name": "Contact Name",
    "Phone": "9876543210",
    "Email": "contact@company.com",
    "Company Website": "https://company.com",
    "Call Status": "New",
    "Location": "Maharashtra"
  }
]
```
**Response:**
```json
{
  "message": "Import complete: 10 added, 2 skipped (duplicates), 0 failed",
  "success": 10,
  "skipped": 2,
  "failed": 0,
  "errors": []
}
```

### Bulk Import Leads (n8n/Google Sheets)
```
POST /api/leads/bulk-import
```
**Request Body:** Array of lead objects with field mappings:
```json
[
  {
    "company_name": "ABC Corp",
    "service_offered": "Consulting",
    "website": "https://abc.com",
    "district": "Mumbai",
    "contact_person": "John Doe",
    "phone": "9876543210",
    "email": "john@abc.com",
    "call_status": "New",
    "follow_up_1": "Pending",
    "follow_up_2": "",
    "status": "Active"
  }
]
```

### n8n Webhook (Single Lead)
```
POST /api/webhooks/n8n-lead
```
Accepts single lead in same format as bulk import.

---

## Error Responses

All API endpoints return errors in the following format:

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)",
  "field": "field_name (for validation errors)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## API Summary

| Category | Endpoints Count |
|----------|-----------------|
| Health & System | 2 |
| Authentication | 2 |
| Dashboard | 2 |
| Leads Management | 10 |
| Accounts Management | 7 |
| Account Contacts | 4 |
| Account Line of Business | 4 |
| Account Departments | 4 |
| Account Use Cases | 4 |
| Department Pain Points | 4 |
| Telecall Logs | 5 |
| Meetings | 6 |
| User Management | 4 |
| Master Data Management | 4 |
| Dropdown/Reference Data | 10 |
| Import/Webhooks | 3 |
| **Total** | **75** |

---

*This documentation was auto-generated from the WB Leads application source code.*
