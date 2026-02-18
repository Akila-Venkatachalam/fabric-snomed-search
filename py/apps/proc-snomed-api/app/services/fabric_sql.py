import os
import pyodbc


def get_connection():
    server = os.environ["FABRIC_SQL_SERVER"]
    database = os.environ["FABRIC_SQL_DATABASE"]

    client_id = os.environ["ENTRA_CLIENT_ID"]
    client_secret = os.environ["ENTRA_CLIENT_SECRET"]

    conn_str = (
        "Driver={ODBC Driver 18 for SQL Server};"
        f"Server={server};"
        f"Database={database};"
        "Encrypt=yes;TrustServerCertificate=no;"
        "Authentication=ActiveDirectoryServicePrincipal;"
        f"UID={client_id};PWD={client_secret};"
    )

    return pyodbc.connect(conn_str)