"""
Citizen Grievance Management System
A console-based application for managing citizen complaints
"""

import json
import os
from datetime import datetime

# File to store complaint data
DATA_FILE = "complaints.json"

class Complaint:
    """Represents a citizen complaint"""
    
    def __init__(self, complaint_id, citizen_name, mobile_number, complaint_type, status="Open"):
        self.complaint_id = complaint_id
        self.citizen_name = citizen_name
        self.mobile_number = mobile_number
        self.complaint_type = complaint_type
        self.status = status
        self.created_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def to_dict(self):
        """Convert complaint to dictionary for JSON storage"""
        return {
            "complaint_id": self.complaint_id,
            "citizen_name": self.citizen_name,
            "mobile_number": self.mobile_number,
            "complaint_type": self.complaint_type,
            "status": self.status,
            "created_date": self.created_date
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create complaint from dictionary"""
        complaint = cls(
            data["complaint_id"],
            data["citizen_name"],
            data["mobile_number"],
            data["complaint_type"],
            data["status"]
        )
        complaint.created_date = data.get("created_date", complaint.created_date)
        return complaint
    
    def __str__(self):
        return f"""
Complaint ID: {self.complaint_id}
Citizen Name: {self.citizen_name}
Mobile Number: {self.mobile_number}
Complaint Type: {self.complaint_type}
Status: {self.status}
Created Date: {self.created_date}
{'=' * 50}
"""

class GrievanceManagementSystem:
    """Main class for managing citizen grievances"""
    
    def __init__(self):
        self.complaints = []
        self.load_complaints()
    
    def load_complaints(self):
        """Load complaints from file if it exists"""
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r') as f:
                    data = json.load(f)
                    self.complaints = [Complaint.from_dict(item) for item in data]
                print(f"[OK] Loaded {len(self.complaints)} complaint(s) from file.\n")
            except Exception as e:
                print(f"[ERROR] Error loading complaints: {e}\n")
                self.complaints = []
        else:
            self.complaints = []
    
    def save_complaints(self):
        """Save complaints to file"""
        try:
            with open(DATA_FILE, 'w') as f:
                data = [complaint.to_dict() for complaint in self.complaints]
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"[ERROR] Error saving complaints: {e}")
            return False
    
    def validate_mobile_number(self, mobile):
        """Validate mobile number length"""
        mobile = mobile.strip()
        # Check if it's 10 digits (standard Indian mobile number)
        if len(mobile) == 10 and mobile.isdigit():
            return True
        return False
    
    def is_duplicate_id(self, complaint_id):
        """Check if complaint ID already exists"""
        return any(c.complaint_id == complaint_id for c in self.complaints)
    
    def add_complaint(self):
        """Add a new complaint"""
        print("\n" + "=" * 50)
        print("ADD NEW COMPLAINT")
        print("=" * 50)
        
        # Get Complaint ID
        while True:
            complaint_id = input("Enter Complaint ID: ").strip()
            if not complaint_id:
                print("[WARNING] Complaint ID cannot be empty. Please try again.")
                continue
            if self.is_duplicate_id(complaint_id):
                print("[WARNING] This Complaint ID already exists. Please use a different ID.")
                continue
            break
        
        # Get Citizen Name
        while True:
            citizen_name = input("Enter Citizen Name: ").strip()
            if not citizen_name:
                print("[WARNING] Citizen Name cannot be empty. Please try again.")
                continue
            break
        
        # Get Mobile Number
        while True:
            mobile_number = input("Enter Mobile Number (10 digits): ").strip()
            if not self.validate_mobile_number(mobile_number):
                print("[WARNING] Invalid mobile number. Please enter exactly 10 digits.")
                continue
            break
        
        # Get Complaint Type
        print("\nComplaint Types:")
        print("1. Water")
        print("2. Electricity")
        print("3. Road")
        print("4. Others")
        
        while True:
            choice = input("Select Complaint Type (1-4): ").strip()
            type_map = {
                "1": "Water",
                "2": "Electricity",
                "3": "Road",
                "4": "Others"
            }
            if choice in type_map:
                complaint_type = type_map[choice]
                break
            else:
                print("[WARNING] Invalid choice. Please select 1, 2, 3, or 4.")
        
        # Create complaint (status defaults to "Open")
        complaint = Complaint(complaint_id, citizen_name, mobile_number, complaint_type)
        self.complaints.append(complaint)
        
        # Save to file
        if self.save_complaints():
            print(f"\n[OK] Complaint added successfully!")
            print(f"  Complaint ID: {complaint_id}")
            print(f"  Status: Open")
        else:
            print("\n[WARNING] Complaint added but could not save to file.")
        
        input("\nPress Enter to continue...")
    
    def view_all_complaints(self):
        """Display all complaints"""
        print("\n" + "=" * 50)
        print("ALL COMPLAINTS")
        print("=" * 50)
        
        if not self.complaints:
            print("\nNo complaints found. The system is empty.")
        else:
            print(f"\nTotal Complaints: {len(self.complaints)}\n")
            for complaint in self.complaints:
                print(complaint)
        
        input("\nPress Enter to continue...")
    
    def update_complaint_status(self):
        """Update the status of a complaint"""
        print("\n" + "=" * 50)
        print("UPDATE COMPLAINT STATUS")
        print("=" * 50)
        
        if not self.complaints:
            print("\nNo complaints found. Please add a complaint first.")
            input("\nPress Enter to continue...")
            return
        
        complaint_id = input("\nEnter Complaint ID to update: ").strip()
        
        # Find the complaint
        complaint = None
        for c in self.complaints:
            if c.complaint_id == complaint_id:
                complaint = c
                break
        
        if not complaint:
            print(f"\n[WARNING] Complaint with ID '{complaint_id}' not found.")
            input("\nPress Enter to continue...")
            return
        
        # Display current status
        print(f"\nCurrent Status: {complaint.status}")
        print("\nAvailable Status Options:")
        print("1. Open")
        print("2. In Progress")
        print("3. Closed")
        
        # Get new status
        while True:
            choice = input("\nSelect new status (1-3): ").strip()
            status_map = {
                "1": "Open",
                "2": "In Progress",
                "3": "Closed"
            }
            if choice in status_map:
                new_status = status_map[choice]
                old_status = complaint.status
                complaint.status = new_status
                
                # Save to file
                if self.save_complaints():
                    print(f"\n[OK] Status updated successfully!")
                    print(f"  Complaint ID: {complaint_id}")
                    print(f"  Old Status: {old_status}")
                    print(f"  New Status: {new_status}")
                else:
                    print("\n[WARNING] Status updated but could not save to file.")
                break
            else:
                print("[WARNING] Invalid choice. Please select 1, 2, or 3.")
        
        input("\nPress Enter to continue...")
    
    def search_complaint(self):
        """Search for a complaint by ID"""
        print("\n" + "=" * 50)
        print("SEARCH COMPLAINT")
        print("=" * 50)
        
        if not self.complaints:
            print("\nNo complaints found. The system is empty.")
            input("\nPress Enter to continue...")
            return
        
        complaint_id = input("\nEnter Complaint ID to search: ").strip()
        
        # Find the complaint
        complaint = None
        for c in self.complaints:
            if c.complaint_id == complaint_id:
                complaint = c
                break
        
        if complaint:
            print("\n[OK] Complaint Found:")
            print(complaint)
        else:
            print(f"\n[WARNING] Complaint with ID '{complaint_id}' not found.")
        
        input("\nPress Enter to continue...")
    
    def display_status_counts(self):
        """Display count of complaints by status (Bonus Feature)"""
        print("\n" + "=" * 50)
        print("COMPLAINT STATUS SUMMARY")
        print("=" * 50)
        
        if not self.complaints:
            print("\nNo complaints found. The system is empty.")
        else:
            status_counts = {"Open": 0, "In Progress": 0, "Closed": 0}
            
            for complaint in self.complaints:
                if complaint.status in status_counts:
                    status_counts[complaint.status] += 1
            
            print("\nStatus-wise Complaint Count:")
            print(f"  Open:         {status_counts['Open']}")
            print(f"  In Progress:  {status_counts['In Progress']}")
            print(f"  Closed:       {status_counts['Closed']}")
            print(f"\n  Total:        {len(self.complaints)}")
        
        input("\nPress Enter to continue...")
    
    def display_menu(self):
        """Display the main menu"""
        print("\n" + "=" * 50)
        print("CITIZEN GRIEVANCE MANAGEMENT SYSTEM")
        print("=" * 50)
        print("1. Add a New Complaint")
        print("2. View All Complaints")
        print("3. Update Complaint Status")
        print("4. Search Complaint by ID")
        print("5. View Status Summary (Bonus)")
        print("6. Exit")
        print("=" * 50)
    
    def run(self):
        """Main program loop"""
        print("\n" + "=" * 50)
        print("Welcome to Citizen Grievance Management System")
        print("=" * 50)
        
        while True:
            self.display_menu()
            choice = input("\nEnter your choice (1-6): ").strip()
            
            if choice == "1":
                self.add_complaint()
            elif choice == "2":
                self.view_all_complaints()
            elif choice == "3":
                self.update_complaint_status()
            elif choice == "4":
                self.search_complaint()
            elif choice == "5":
                self.display_status_counts()
            elif choice == "6":
                print("\n" + "=" * 50)
                print("Thank you for using the Grievance Management System!")
                print("=" * 50)
                # Save before exiting
                self.save_complaints()
                break
            else:
                print("\n[WARNING] Invalid choice. Please select a number between 1 and 6.")
                input("\nPress Enter to continue...")

def main():
    """Entry point of the application"""
    try:
        system = GrievanceManagementSystem()
        system.run()
    except KeyboardInterrupt:
        print("\n\n[WARNING] Program interrupted by user.")
        print("Saving data...")
        # Attempt to save if system exists
        try:
            system.save_complaints()
        except:
            pass
        print("Goodbye!")
    except Exception as e:
        print(f"\n[ERROR] An error occurred: {e}")
        print("Please contact the system administrator.")

if __name__ == "__main__":
    main()
