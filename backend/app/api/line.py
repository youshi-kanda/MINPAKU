from fastapi import APIRouter, HTTPException, Body
from app.models.property import Property
from app.services.line_service import send_notification
from app.api.revenue import calculate_revenue_projections
from typing import Dict, Any

router = APIRouter()

@router.post("/line/notify")
async def send_line_notification(property_data: Property, line_user_id: str = Body(..., embed=True)):
    projections = calculate_revenue_projections(property_data.dict())
    result = send_notification(line_user_id, property_data.dict(), projections)
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
        
    return {"status": "success", "message": "Notification sent successfully"}
