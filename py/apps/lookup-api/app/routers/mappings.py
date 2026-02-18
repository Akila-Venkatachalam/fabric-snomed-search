from fastapi import APIRouter, Query
from typing import Dict
from app.services.fabric_sql import get_connection

router = APIRouter()


def normalize(text: str) -> str:
    cleaned = "".join(ch.lower() if ch.isalnum() or ch.isspace() else " " for ch in text)
    return " ".join(cleaned.split())


@router.get("/search")
def search_mappings(
    q: str = Query(..., min_length=2, description="Homegrown procedure text"),
    limit: int = Query(10, ge=1, le=50),
) -> Dict:
    qn = normalize(q)
    pattern = f"%{qn}%"

    sql = '''
    SELECT TOP (?)
        homegrown_name,
        snomed_code,
        snomed_standard_name
    FROM [FHIR_Gold_Analytics].[dbo].[snomed_sample]
    WHERE LOWER(homegrown_name) LIKE ?
    ORDER BY homegrown_name
    '''

    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute(sql, limit, pattern)
        rows = cur.fetchall()

    results = [
        {
            "homegrown_name": r.homegrown_name,
            "snomed_code": r.snomed_code,
            "snomed_name": r.snomed_standard_name,
            "score": 0.8,
        }
        for r in rows
    ]

    return {"query": q, "results": results}