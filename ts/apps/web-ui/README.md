# secure-fabric-lookup-service

![Microsoft Fabric](https://img.shields.io/badge/Microsoft%20Fabric-0078D4?logo=microsoft&logoColor=white)
![Azure Container Apps](https://img.shields.io/badge/Azure%20Container%20Apps-0078D4?logo=microsoftazure&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Microsoft Entra ID](https://img.shields.io/badge/Microsoft%20Entra%20ID-0078D4?logo=microsoft&logoColor=white)

A **secure, containerized lookup service** that**.  
It exposes a **React UI** and a **FastAPI backend**, deployed to **Azure Container Apps**, with optional **Microsoft Entra ID** authentication.  
The recommended enterprise deployment uses **single-origin routing** (no browser CORS) and an **internal-only API**.  
References: Azure Container Apps `up` command and supported flows (local source / GitHub) are documented by Microsoft Learn. [1](https://stackoverflow.com/questions/66416550/starlette-cors-exclude-endpoint)

---

## What does this project do?

- Accepts a user-provided **search term**
- Retrieves matching entries from a **reference dataset**
- Returns a list of `{ source_term, reference_code, reference_label }`
- Provides a clean UI for search and result selection

> This project demonstrates a **generic lookup/search pattern** that applies to many catalogs (terminology catalogs, product master data, internal code sets, etc.).

---

## Architecture Overview

**Components**
- **Frontend**: React + TypeScript (served via Nginx)  
- **Backend**: FastAPI (Python)  
- **Data source**: Microsoft Fabric Lakehouse SQL endpoint (read-only)  
- **Deployment**: Azure Container Apps  
- **Authentication (optional)**: Microsoft Entra ID using Container Apps built-in auth (“Easy Auth”) 

**Security design (recommended enterprise pattern)**
- UI is public (external ingress) and can be protected with Entra ID
- API is **internal-only** (internal ingress) inside the Container Apps environment
- UI calls `/api/...` on the **same origin**, and Nginx reverse-proxies to the internal API → **no CORS issues**
- Internal/external ingress patterns are described in the Container Apps ingress documentation, and apps can communicate within the same environment without leaving it. [2](https://pypi.org/project/fastapi-microsoft-identity/)

**Why no CORS?**
- Browsers block cross-origin calls unless the backend returns proper CORS headers; FastAPI explains this “different origin” behavior and recommends explicit allowlists for allowed origins. [3](https://learn.microsoft.com/en-us/entra/identity-platform/tutorial-single-page-app-react-prepare-app)  
- This repo avoids cross-origin calls by using **single-origin routing** + **reverse proxy**. A reference implementation for Nginx reverse proxy routing inside Azure Container Apps is available in Microsoft’s community guidance. [4](https://github.com/anthonychu/container-apps-nginx)

---

## Repository Structure (important paths)

```text
py/apps/lookup-api/
  app/
    main.py
    routers/
      health.py
      mappings.py        <-- query logic here
    services/
      fabric_sql.py      <-- Fabric env vars + connection here
  requirements.txt
  Dockerfile

ts/apps/web-ui/
  src/
    App.tsx              <-- UI logic + fetch(/api/...)
    App.css              <-- UI styling
  nginx.conf             <-- reverse proxy /api -> internal API
  Dockerfile             <-- Node build stage -> Nginx runtime
  .dockerignore
  index.html
  package.json
  vite.config.ts
``