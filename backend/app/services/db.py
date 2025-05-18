import os
from dotenv import load_dotenv

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
