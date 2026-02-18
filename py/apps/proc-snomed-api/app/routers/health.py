from fastapi import APIRouter

router = APIRouter()

@router.get("/healthz")
def healthz():
    return {"status": "ok"}

@router.get("/readyz")
def readyz():
    # Recommended: implement a real Fabric connectivity check (SELECT 1)
    return {"status": "ready"}
