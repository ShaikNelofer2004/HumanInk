import os
from supabase import create_client, Client
from typing import Optional, Dict, Any

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# Initialize the Supabase client safely
if url and key:
    supabase: Client = create_client(url, key)
else:
    supabase = None

def get_user_profiles(clerk_user_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetches the profile document for the given clerk user id.
    Returns None if no profile exists or if supabase is not configured.
    """
    if not supabase:
        print("Warning: Supabase client not initialized.")
        return None
        
    try:
        response = supabase.table("user_profiles").select("profile_data").eq("clerk_user_id", clerk_user_id).execute()
        
        if len(response.data) > 0:
            return response.data[0]["profile_data"]
        return None
    except Exception as e:
        print(f"Error fetching profile from Supabase: {e}")
        raise Exception("Database connection failed") from e

def upsert_user_profile(clerk_user_id: str, profile_data: Dict[str, Any]) -> bool:
    """
    Inserts or updates the profile for a given clerk user id.
    """
    if not supabase:
        print("Warning: Supabase client not initialized.")
        return False
        
    try:
        # Check if exists to decide insert or update
        # Supabase python SDK currently prefers explicit updates or inserts based on unique constraints
        # Since clerk_user_id is unique, we can use upsert if we configured the table properly, 
        # but the safest standard way is to select then insert/update
        
        existing = supabase.table("user_profiles").select("id").eq("clerk_user_id", clerk_user_id).execute()
        
        if len(existing.data) > 0:
            # Update
            supabase.table("user_profiles").update({"profile_data": profile_data}).eq("clerk_user_id", clerk_user_id).execute()
        else:
            # Insert
            supabase.table("user_profiles").insert({
                "clerk_user_id": clerk_user_id,
                "profile_data": profile_data
            }).execute()
            
        return True
    except Exception as e:
        print(f"Error saving profile to Supabase: {e}")
        return False
