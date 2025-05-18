from fastapi import APIRouter, HTTPException, Body
from app.models.property import Property
from app.services.pdf_generator import generate_revenue_report
from fastapi.responses import FileResponse
import os
import tempfile

router = APIRouter()

def calculate_revenue_projections(property_data):
    """Calculate revenue projections based on property data"""
    base_rate = 10000  # Base nightly rate in yen
    
    if property_data['property_type'] == "一軒家":
        base_rate *= 1.5
    elif property_data['property_type'] == "高級マンション":
        base_rate *= 1.3
        
    if property_data['has_renovation']:
        base_rate *= 1.2
        
    age_factor = max(0.7, 1 - (property_data['building_age'] * 0.01))
    base_rate *= age_factor
    
    monthly = {}
    seasons = {
        "1月": 0.7, "2月": 0.7, "3月": 0.8,
        "4月": 0.9, "5月": 1.1, "6月": 0.9,
        "7月": 1.2, "8月": 1.3, "9月": 1.0,
        "10月": 1.0, "11月": 0.8, "12月": 1.2
    }
    
    for month, factor in seasons.items():
        monthly_rate = base_rate * factor
        occupancy = min(0.9, property_data['competitor_ratio'] * 0.8)  # Max 90% occupancy
        
        days = 30
        average_stay = property_data['average_stays']
        bookings = (days * occupancy) / average_stay
        
        revenue = monthly_rate * bookings * average_stay
        
        cleaning_cost = property_data['cleaning_cost_basis'] * bookings
        platform_fee = revenue * 0.03  # Assumed 3% platform fee
        maintenance = revenue * 0.05  # Assumed 5% maintenance cost
        
        expenses = cleaning_cost + platform_fee + maintenance
        profit = revenue - expenses
        
        monthly[month] = {
            "revenue": int(revenue),
            "expenses": int(expenses),
            "profit": int(profit)
        }
    
    return {
        "monthly": monthly,
        "property_id": property_data.get('id', 'unknown')
    }

@router.post("/revenue/calculate")
async def calculate_revenue(property_data: Property):
    projections = calculate_revenue_projections(property_data.dict())
    return projections
    
@router.post("/revenue/pdf")
async def generate_pdf_report(property_data: Property):
    projections = calculate_revenue_projections(property_data.dict())
    pdf_path = generate_revenue_report(property_data.dict(), projections)
    
    return FileResponse(
        path=pdf_path,
        filename=f"{property_data.facility_name}_revenue_report.pdf",
        media_type="application/pdf"
    )
