# secure-fabric-lookup-service

![Microsoft Fabric](https://img.shields.io/badge/Microsoft%20Fabric-0078D4?logo=microsoft&logoColor=white)
![Azure Container Apps](https://img.shields.io/badge/Azure%20Container%20Apps-0078D4?logo=microsoftazure&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Microsoft Entra ID](https://img.shields.io/badge/Microsoft%20Entra%20ID-0078D4?logo=microsoft&logoColor=white)

A secure, containerized web application to search SNOMED clinical procedure codes from Microsoft Fabric using Azure Container Apps and Entra ID authentication.

## What does this project do?

- Allows users to search homegrown clinical procedure names
- Retrieves matching SNOMED codes and standard names
- Reads data from a Microsoft Fabric Lakehouse (SQL endpoint)
- Provides a simple web UI for fast lookup

## Architecture Overview

- Frontend: React + TypeScript, served via Nginx
- Backend: FastAPI (Python)
- Data source: Microsoft Fabric Lakehouse (read-only)
- Deployment: Azure Container Apps
- Authentication: Microsoft Entra ID

Security design:
- UI is externally accessible and protected by Entra ID
- API is internal-only within the Container Apps environment
- UI communicates with API via Nginx reverse proxy (no CORS issues)

## Security Notes

- No secrets are stored in this repository
- Backend accesses Fabric using a service principal with read-only permissions
- API is not publicly accessible
- Authentication is handled via Microsoft Entra ID

## Author

Akila Venkatachalam  
Healthcare Data Scientist | Microsoft Fabric | Azure
