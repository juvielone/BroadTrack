# BroadTrack – CRM for Telco Technicians *(On-going)*

**GitHub:** [github.com/juvielone/broadtrack](#)  

> **Product Requirements Document** — Version 1.0 | MVP Scope | May 2026

---

## Table of Contents

- [Product Overview](#1-product-overview)
- [Goals & Objectives](#2-goals--objectives)
- [User Roles & Permissions](#3-user-roles--permissions)
- [Core Features](#4-core-features)
- [Key User Flows](#5-key-user-flows)
- [Out of Scope (Post-MVP)](#6-out-of-scope-post-mvp)
- [Assumptions & Constraints](#7-assumptions--constraints)

---

## 1. Product Overview

A centralized job and expense tracking system designed for field technicians. The system enables project managers to create and assign jobs, technicians to log their work and expenses, and management to track costs, progress, and accountability across all jobs.

---

## 2. Goals & Objectives

- Centralize job creation, assignment, and tracking in one platform
- Enable technicians to document their work with photos, procedure steps, and expense records
- Give project managers real-time visibility into job progress and costs
- Support a reimbursement workflow for technician and PM expenses
- Maintain a full audit trail of all actions for accountability
- Track pay per completed project for each technician

---

## 3. User Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Admin** | Full system access and user management | All permissions across the system |
| **Project Manager (PM)** | Creates jobs, assigns technicians, manages expenses and approvals | Create/assign/close jobs, add expenses, approve reimbursements, view all data |
| **Technician** | Receives assigned jobs, logs work and expenses | View assigned jobs, log procedure steps, upload expenses, clock in via photo |
| **Finance** | Views financial data for auditing and reporting | View all expenses, reimbursement statuses, and job costs (read-only) |

---

## 4. Core Features

### 4.1 Job Management

- Project managers (or authorized users) can create jobs with a title, description, and structured procedure steps
- Each job is a standalone entity that can be assigned to one or more technicians
- Job statuses: `In Progress` | `On Hold` (with reason) | `Completed`
- PM formally closes a job once all steps are done; PM can also reopen a closed job
- Technicians cannot close or lock jobs
- Multiple jobs can exist for the same project site

### 4.2 Procedure Steps

- PM defines a structured step template when creating the job (e.g., Install MDU in Unit 1, Unit 2, Unit 3)
- Steps can have sub-steps or branches for detailed tracking
- Technicians follow the PM-defined structure and populate each step with their actual work details
- Each step entry includes: description of work done, photo upload (mandatory), and optional notes
- Technicians can mark individual steps as done at any time, even while the overall job is ongoing
- PM can monitor step completion in real time

### 4.3 Expense Tracking

- Both PMs and technicians can log expenses against a job
- PMs may add upfront equipment costs before work begins
- Technicians log out-of-pocket expenses as they arise during the job
- Each expense entry includes: amount, item description, receipt image (mandatory), and optional notes
- Total expenses per job are visible to PMs, Finance, and Admins

### 4.4 Reimbursement Workflow

- Submitted expenses enter a pending reimbursement queue
- Project managers have authority to approve or reject reimbursement requests
- Finance has read-only visibility into all reimbursements for auditing
- Status values: `Pending` | `Approved` | `Rejected`
- Rejected reimbursements must include a reason

### 4.5 Time Tracking

- PM initiates a work session by sending a start-work approval to the assigned technician
- Technician accepts the start signal, which begins the time tracking clock
- Hours worked are tracked per job per technician
- Time data is used for visibility and labor cost reporting, not automated pay calculation

### 4.6 Pay Per Project

- Technician compensation is calculated per completed project
- The system tracks total hours and expenses per job to provide a complete cost picture
- Actual payment is processed externally; the app provides the data needed to support it

### 4.7 Audit Trail

- All actions in the system are logged with a timestamp and the user who performed them
- Tracked actions include: job creation, assignment, step completion, expense submissions, approvals, rejections, job status changes, and job closures
- Audit logs are viewable by Admins and PMs for accountability

---

## 5. Key User Flows

### 5.1 Job Creation & Assignment Flow

1. PM creates a new job with title, description, and structured procedure steps
2. PM assigns one or more technicians to the job
3. Assigned technicians receive a notification of the new job
4. PM sends a start-work approval to the technician when ready
5. Technician accepts — time tracking begins

### 5.2 Technician Work Logging Flow

1. Technician views their assigned job and procedure steps
2. For each step: technician uploads a mandatory photo, adds a description, and marks the step as done
3. Technician logs any expenses incurred, uploading a receipt image
4. PM tracks progress in real time via the job dashboard

### 5.3 Expense Reimbursement Flow

1. Technician or PM submits an expense with receipt and details
2. Expense enters the pending reimbursement queue
3. PM reviews and approves or rejects the reimbursement request
4. Finance views the outcome for audit records
5. Technician is notified of approval or rejection

### 5.4 Job Completion Flow

1. All procedure steps are completed and marked done by technician(s)
2. PM reviews the job summary — steps, expenses, hours
3. PM formally closes the job, changing status to `Completed`
4. All data is locked; PM can reopen if corrections are needed

---

## 6. Out of Scope (Post-MVP)

- Finance approval layer for reimbursements *(Finance is read-only in MVP)*
- Automated payroll or payment processing
- Invoicing and billing to clients
- Mobile app (native iOS/Android) — MVP is web-based
- Third-party integrations (accounting software, HR systems)
- Advanced reporting and analytics dashboards

---

## 7. Assumptions & Constraints

- The system will be web-based for the MVP
- Internet connectivity is required for technicians to upload photos and log work
- Receipt image uploads are mandatory for all expense entries — no image, no submission
- Pay model is per completed project; hourly breakdowns are for visibility only
- Project managers are the sole approvers for reimbursements in the MVP
- Each job is independent — there is no parent project grouping in the MVP

---

*End of Document — Subject to revision based on client feedback*
