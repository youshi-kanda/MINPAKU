from fastapi import APIRouter, HTTPException, Depends
from app.models.property import Property
from app.services.db import properties, firestore_db, supabase_client, save_property_to_database, get_properties_from_database
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/properties/", response_model=Property)
async def create_property(property: Property):
    property.id = str(uuid.uuid4())
    property.created_at = datetime.now()
    property.updated_at = datetime.now()
    
    property_dict = property.dict()
    properties.append(property_dict)
    
    await save_property_to_database(property_dict)
        
    return property
    
@router.get("/properties/", response_model=list[Property])
async def read_properties():
    if firestore_db or supabase_client:
        return await get_properties_from_database()
    return properties
    
@router.get("/properties/{property_id}", response_model=Property)
async def read_property(property_id: str):
    for prop in properties:
        if prop["id"] == property_id:
            return prop
    raise HTTPException(status_code=404, detail="Property not found")
