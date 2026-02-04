// Simple in-browser implementation of the Citizen Grievance Management System
// Uses localStorage for persistence

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

function renderComplaintsTable(complaints) {
  const container = document.getElementById("complaintsContainer");
  if (!container) {
    return;
  }
  if (!complaints.length) {
    container.innerHTML = "<p>No complaints found.</p>";
    return;
  }

  const rows = complaints
    .map(
      (c) => `
      <tr>
        <td>${c.complaint_id}</td>
        <td>${c.citizen_name}</td>
        <td>${c.mobile_number}</td>
        <td>${c.complaint_type}</td>
        <td>${renderStatusBadge(c.status)}</td>
        <td>${c.created_date || ""}</td>
      </tr>
    `
    )
    .join("");

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Citizen Name</th>
          <th>Mobile</th>
          <th>Type</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderStatusBadge(status) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "in progress") {
    return `<span class="badge in-progress">In Progress</span>`;
  }
  if (normalized === "closed") {
    return `<span class="badge closed">Closed</span>`;
  }
  if (normalized === "completed") {
    return `<span class="badge completed">Completed</span>`;
  }
  return `<span class="badge open">Open</span>`;
}

function renderUserStatus(complaint) {
  const summaryEl = document.getElementById("statusSummary");
  if (!summaryEl) return;
  // Blank when no complaint yet
  if (!complaint) {
    summaryEl.innerHTML = "";
    return;
  }
  summaryEl.innerHTML = `
    <li>Complaint ID: ${complaint.complaint_id}</li>
    <li>Current Status: ${complaint.status}</li>
  `;
}

function showFormMessage(text, type) {
  const el = document.getElementById("formMessage");
  el.textContent = text || "";
  el.className = "message " + (type || "");
}

function showUpdateMessage(text, type) {
  // Kept for compatibility if needed later; not used on citizen page now
}

function renderSearchResult(complaint) {
  const container = document.getElementById("searchResult");
  if (!complaint) {
    container.innerHTML = `<p>No complaint found for the given ID.</p>`;
    return;
  }
  container.innerHTML = `
    <p><strong>ID:</strong> ${complaint.complaint_id}</p>
    <p><strong>Name:</strong> ${complaint.citizen_name}</p>
    <p><strong>Mobile:</strong> ${complaint.mobile_number}</p>
    <p><strong>Type:</strong> ${complaint.complaint_type}</p>
    <p><strong>Status:</strong> ${complaint.status}</p>
    <p><strong>Created:</strong> ${complaint.created_date || ""}</p>
  `;
}

function init() {
  let complaints = loadComplaints();

  const searchBtn = document.getElementById("searchBtn");

  // Start with blank status for new visitors
  renderUserStatus(null);


  searchBtn.addEventListener("click", () => {
    const id = document.getElementById("searchId").value.trim();
    if (!id) {
      document.getElementById("searchResult").innerHTML = "<p>Please enter a Complaint ID.</p>";
      return;
    }
    const found = complaints.find((c) => c.complaint_id === id) || null;
    renderSearchResult(found);
    renderUserStatus(found);
  });

  // Scroll-based reveal animations for main content sections
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach((el) => observer.observe(el));
    } else {
      // Fallback for very old browsers
      revealEls.forEach((el) => el.classList.add("in-view"));
    }
  }
}

document.addEventListener("DOMContentLoaded", init);

