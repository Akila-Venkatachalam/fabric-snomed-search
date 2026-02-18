FROM python:3.11-slim-bookworm

# Install ODBC Driver 18 and dependencies
RUN apt-get update && apt-get install -y     curl ca-certificates gnupg apt-transport-https     unixodbc unixodbc-dev     && mkdir -p /usr/share/keyrings     && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg     && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main"         > /etc/apt/sources.list.d/mssql-release.list     && apt-get update     && ACCEPT_EULA=Y apt-get install -y msodbcsql18     && apt-get clean     && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app/app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
