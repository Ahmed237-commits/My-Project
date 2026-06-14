# Healthy Life

Healthy Life is a full-stack digital health and nutrition platform designed to consolidate essential wellness utilities—such as calorie tracking, macronutrient monitoring, BMI calculations, and personalized workout scheduling—into a single, integrated web application.

The primary focus of this project is to demonstrate clean system architecture, optimized database interactions, and modern containerized deployment workflows.

---

## Key Capabilities

* **Automated Health Metrics:** Real-time calculation of BMI and daily caloric targets based on dynamic user data inputs.
* **Nutrition & Progress Logging:** Secure data pipelines for tracking daily meals, breakdown of macronutrients, and historical fitness metrics.
* **Structured Workout Planner:** An interactive scheduling engine that maps out routines and tracks exercise completion.
* **Scalable Data Architecture:** Optimized backend services structured to handle frequent state mutations and heavy data payloads efficiently.

---

## Engineering & Architecture Focus

The codebase is built from the ground up adhering to Clean Code principles and robust system design patterns:

* **Separation of Concerns:** Strict decoupling between UI rendering layers, server-side business logic, and database schemas.
* **Database Optimization:** Structured data modeling with MongoDB to minimize lookup latency and ensure seamless schema management.
* **Containerization:** The entire application runtime environment is fully orchestrated using Docker, eliminating the "it works on my machine" paradigm and ensuring parity between local development and production.

---

## Technical Stack

* **Frontend Framework:** Next.js (App Router), React, Tailwind CSS
* **Backend Runtime:** Node.js, Next.js Server Actions / API Routes
* **Database Layer:** MongoDB (Mongoose ODM)
* **DevOps & Infrastructure:** Docker, Docker Compose

---

## Environment Setup & Installation

### Prerequisites
Ensure you have Docker and Docker Compose installed on your local environment.

### Step-by-Step Deployment

1. **Clone the Repository**
```bash
   git clone [https://github.com/Ahmed237-commits/My-Project.git](https://github.com/Ahmed237-commits/My-Project.git)
   cd Project-Root
