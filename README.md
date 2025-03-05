# CoWorkrz

A full-stack application with a React frontend, Node.js backend, and Python service.

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Python Service Setup](#python-service-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Hackathon Theme](#hackathon-theme)
- [Deliverables](#deliverables)
- [Evaluation Criteria](#evaluation-criteria)

## Project Overview
CoWorkrz is a collaborative text content creation platform with an integrated AI assistant, designed to help teams brainstorm, draft, edit, and refine content together in real-time. 

This project consists of three main components:

- **Frontend**: Built with React.
- **Backend**: Built with Node.js and Express.
- **Python Service**: A Python-based microservice.

## Prerequisites
Before setting up the project, ensure you have the following installed:

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm (comes with Node.js)
- Git

## Setup Instructions

### Frontend Setup
Navigate to the frontend directory:

```bash
cd Website_Frontend
```

Install dependencies:

```bash
npm i --legacy-peer-deps
```

Start the development server:

```bash
npm run dev 
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

### Backend Setup
Navigate to the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm i
```

Start the backend server:

```bash
npm run dev
```

The backend will be available at [http://localhost:3000](http://localhost:3000).

### Python Service Setup
Create a Python virtual environment:

```bash
python -m venv python_venv
```

Activate the virtual environment:

On Windows:

```bash
python_venv\Scripts\activate
```

On macOS/Linux:

```bash
source python_venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the Python service:

```bash
python app.py 
```

The Python service will be available at [http://localhost:5000](http://localhost:5000).

## Running the Application

Start the Python service:

```bash
cd path/to/python_service
python_venv\Scripts\activate
python app.py PORT=5000
```

Start the backend server:

```bash
cd path/to/Backend
npm run dev PORT=3000
```

Start the frontend development server:

```bash
cd path/to/Website_Frontend
npm run dev PORT=5173
```

Open your browser and navigate to:

[http://localhost:5173](http://localhost:5173)

## Project Structure
```
project-root/
│── Backend/            # Node.js Backend
│── Website_Frontend/   # React Frontend
│── Python_Service/     # Python Microservice
│── README.md           # Project Documentation
```


---
### 🚀 Get started and bring AI-powered collaboration to life!
