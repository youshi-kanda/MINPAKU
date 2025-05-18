import os
from dotenv import load_dotenv
from typing import Optional, Dict, Any

load_dotenv()

properties = []

def init_firestore():
    if os.getenv("USE_FIRESTORE", "false").lower() == "true":
        try:
            import firebase_admin
            from firebase_admin import credentials
            from firebase_admin import firestore
            
            cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            return db
        except ImportError:
            print("Firebase admin SDK not installed. Run 'poetry add firebase-admin'")
        except Exception as e:
            print(f"Error initializing Firestore: {e}")
    return None
    
firestore_db = init_firestore()

def init_supabase():
    if os.getenv("USE_SUPABASE", "false").lower() == "true":
        try:
            from supabase import create_client
            
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_KEY")
            
            if not supabase_url or not supabase_key:
                print("Supabase URL or API key not set in environment variables")
                return None
                
            supabase = create_client(supabase_url, supabase_key)
            return supabase
        except ImportError:
            print("Supabase client not installed. Run 'poetry add supabase'")
        except Exception as e:
            print(f"Error initializing Supabase: {e}")
    return None

supabase_client = init_supabase()

async def save_property_to_database(property_data: Dict[str, Any]) -> None:
    """Save property data to configured databases"""
    if firestore_db:
        try:
            firestore_db.collection("properties").document(property_data["id"]).set(property_data)
            print(f"Property saved to Firestore: {property_data['id']}")
        except Exception as e:
            print(f"Error saving to Firestore: {e}")
    
    if supabase_client:
        try:
            result = supabase_client.table("properties").insert(property_data).execute()
            if not result.data:
                print(f"Error saving to Supabase: {result.error}")
            else:
                print(f"Property saved to Supabase: {property_data['id']}")
        except Exception as e:
            print(f"Error saving to Supabase: {e}")

async def get_properties_from_database() -> list:
    """Get properties from database based on configuration"""
    if not firestore_db and not supabase_client:
        return properties
        
    if firestore_db:
        try:
            docs = firestore_db.collection("properties").stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Error fetching from Firestore: {e}")
    
    if supabase_client:
        try:
            result = supabase_client.table("properties").select("*").execute()
            if result.data:
                return result.data
            else:
                print(f"Error fetching from Supabase: {result.error}")
        except Exception as e:
            print(f"Error fetching from Supabase: {e}")
    
    return properties
