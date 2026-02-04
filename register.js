// Register page script: only handles adding new complaints

const STORAGE_KEY = "cgms_complaints";

function loadComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveComplaints(complaints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function generateCreatedDate() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    " " +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes()) +
    ":" +
    pad(now.getSeconds())
  );
}

function validateMobileNumber(mobile) {
  const trimmed = (mobile || "").trim();
  return trimmed.length === 10 && /^\d{10}$/.test(trimmed);
}

function showFormMessage(text, type) {
  const el = document.getElementById("formMessage");
  el.textContent = text || "";
  el.className = "message " + (type || "");
}

function initRegister() {
  let complaints = loadComplaints();
  const form = document.getElementById("complaint-form");
  const complaintTypeSelect = document.getElementById("complaintType");
  const otherRow = document.getElementById("otherComplaintRow");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showFormMessage("", "");

    const complaintId = document.getElementById("complaintId").value.trim();
    const citizenName = document.getElementById("citizenName").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const complaintType = document.getElementById("complaintType").value;
    const otherComplaint = document.getElementById("otherComplaint").value.trim();

    if (!complaintId) {
      showFormMessage("Complaint ID cannot be empty.", "error");
      return;
    }
    if (complaints.some((c) => c.complaint_id === complaintId)) {
      showFormMessage(
        "Complaint ID already exists. Please use a different ID.",
        "error"
      );
      return;
    }
    if (!citizenName) {
      showFormMessage("Citizen Name cannot be empty.", "error");
      return;
    }
    if (!validateMobileNumber(mobileNumber)) {
      showFormMessage(
        "Invalid mobile number. Please enter exactly 10 digits.",
        "error"
      );
      return;
    }
    if (!complaintType) {
      showFormMessage("Please select your complaint type.", "error");
      return;
    }
    if (complaintType === "Others" && !otherComplaint) {
      showFormMessage("Please describe your complaint.", "error");
      return;
    }

    const newComplaint = {
      complaint_id: complaintId,
      citizen_name: citizenName,
      mobile_number: mobileNumber,
      complaint_type: complaintType,
      other_details: complaintType === "Others" ? otherComplaint : "",
      status: "Open",
      created_date: generateCreatedDate(),
    };

    complaints.push(newComplaint);
    saveComplaints(complaints);

    form.reset();
    showFormMessage(
      "Complaint submitted successfully. You can now track it on the main portal using this Complaint ID.",
      "success"
    );
  });

  if (complaintTypeSelect && otherRow) {
    complaintTypeSelect.addEventListener("change", () => {
      if (complaintTypeSelect.value === "Others") {
        otherRow.style.display = "flex";
      } else {
        otherRow.style.display = "none";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initRegister);

