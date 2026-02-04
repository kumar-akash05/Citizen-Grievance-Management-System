# Citizen Grievance Management System

A console-based application for managing citizen complaints in a government department.

## Features

### Core Features
- ✅ **Add New Complaint**: Register complaints with validation
  - Unique Complaint ID validation
  - Mobile number validation (10 digits)
  - Complaint type selection (Water, Electricity, Road, Others)
  - Default status: Open

- ✅ **View All Complaints**: Display all registered complaints with details

- ✅ **Update Complaint Status**: Change status to:
  - Open
  - In Progress
  - Closed

- ✅ **Search Complaint**: Find complaints by Complaint ID

- ✅ **Exit**: Safely terminate the application with data persistence

### Bonus Features
- ✅ **File Persistence**: All complaints are automatically saved to `complaints.json`
- ✅ **Status Summary**: View count of complaints by status (Open, In Progress, Closed)

## Requirements

- Python 3.6 or higher
- No external dependencies (uses only standard library)

## How to Run

1. Make sure Python is installed on your system
2. Open a terminal/command prompt in the project directory
3. Run the following command:

```bash
python grievance_system.py
```

## Usage Guide

### Main Menu Options

1. **Add a New Complaint**
   - Enter a unique Complaint ID
   - Enter Citizen Name
   - Enter Mobile Number (must be exactly 10 digits)
   - Select Complaint Type from the list
   - Complaint is automatically saved with "Open" status

2. **View All Complaints**
   - Displays all registered complaints
   - Shows Complaint ID, Citizen Name, Mobile Number, Type, Status, and Created Date

3. **Update Complaint Status**
   - Enter the Complaint ID
   - Select new status from available options
   - Status is updated and saved automatically

4. **Search Complaint by ID**
   - Enter the Complaint ID to search
   - Displays full complaint details if found

5. **View Status Summary** (Bonus)
   - Shows count of complaints grouped by status
   - Displays total number of complaints

6. **Exit**
   - Safely closes the application
   - All data is automatically saved

## Data Storage

- All complaint data is stored in `complaints.json`
- Data is automatically loaded when the program starts
- Data is saved after every add/update operation
- Data persists between program sessions

## Input Validation

- **Complaint ID**: Must be unique, cannot be empty
- **Mobile Number**: Must be exactly 10 digits
- **Citizen Name**: Cannot be empty
- **Complaint Type**: Must be selected from available options (1-4)
- **Status**: Must be selected from available options (1-3)

## Example Workflow

1. Start the program
2. Select option 1 to add a new complaint
3. Enter complaint details
4. View all complaints using option 2
5. Update status using option 3
6. Search for specific complaints using option 4
7. View status summary using option 5
8. Exit using option 6

## File Structure

```
.
├── grievance_system.py    # Main application file
├── complaints.json        # Data storage file (created automatically)
└── README.md             # This file
```

## Technical Details

- **Language**: Python 3
- **Storage**: JSON file for persistence
- **Data Structure**: List of Complaint objects
- **Validation**: Input validation for all user inputs
- **Error Handling**: Graceful error handling with user-friendly messages

## Notes

- The system automatically creates `complaints.json` on first use
- All dates are stored in format: YYYY-MM-DD HH:MM:SS
- The system handles file read/write errors gracefully
- Press Ctrl+C to interrupt the program (data will be saved)
