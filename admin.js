// Admin Grievance Management System - reads same data as public site

const ADMIN_STORAGE_KEY = "cgms_complaints"; // same key as script.js

function adminLoadComplaints() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function adminSaveComplaints(complaints) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(complaints));
}

function adminRenderStatusBadge(status) {
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

function adminRenderComplaintsTable(complaints) {
  const container = document.getElementById("adminComplaintsContainer");
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
        <td>${adminRenderStatusBadge(c.status)}</td>
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

function adminRenderStatusSummary(complaints) {
  const summaryEl = document.getElementById("adminStatusSummary");
  if (!complaints.length) {
    summaryEl.innerHTML = `<li>No complaints found.</li>`;
    return;
  }
  const counts = { Open: 0, "In Progress": 0, Closed: 0, Completed: 0 };
  complaints.forEach((c) => {
    if (counts[c.status] !== undefined) {
      counts[c.status] += 1;
    }
  });
  const total = complaints.length;
  summaryEl.innerHTML = `
    <li>Open: ${counts["Open"]}</li>
    <li>In Progress: ${counts["In Progress"]}</li>
    <li>Closed: ${counts["Closed"]}</li>
    <li>Completed: ${counts["Completed"]}</li>
    <li><strong>Total: ${total}</strong></li>
  `;
}

function adminShowSearchResult(complaint) {
  const container = document.getElementById("adminSearchResult");
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

function adminShowUpdateMessage(text, type) {
  const el = document.getElementById("adminUpdateMessage");
  el.textContent = text || "";
  el.className = "message " + (type || "");
}

function adminInit() {
  let complaints = adminLoadComplaints();

  const refreshBtn = document.getElementById("refreshAdminList");
  const searchBtn = document.getElementById("adminSearchBtn");
  const updateStatusBtn = document.getElementById("adminUpdateStatusBtn");

  function refreshUI() {
    complaints = adminLoadComplaints(); // always reload latest
    adminRenderComplaintsTable(complaints);
    adminRenderStatusSummary(complaints);
  }

  refreshUI();

  refreshBtn.addEventListener("click", () => {
    refreshUI();
  });

  searchBtn.addEventListener("click", () => {
    const id = document.getElementById("adminSearchId").value.trim();
    if (!id) {
      document.getElementById("adminSearchResult").innerHTML =
        "<p>Please enter a Complaint ID.</p>";
      return;
    }
    complaints = adminLoadComplaints();
    const found = complaints.find((c) => c.complaint_id === id) || null;
    adminShowSearchResult(found);
  });

  updateStatusBtn.addEventListener("click", () => {
    adminShowUpdateMessage("", "");
    const id = document.getElementById("adminUpdateId").value.trim();
    const newStatus = document.getElementById("adminNewStatus").value;
    if (!id) {
      adminShowUpdateMessage("Please enter a Complaint ID.", "error");
      return;
    }
    complaints = adminLoadComplaints();
    const idx = complaints.findIndex((c) => c.complaint_id === id);
    if (idx === -1) {
      adminShowUpdateMessage("Complaint not found for the given ID.", "error");
      return;
    }
    complaints[idx].status = newStatus;
    adminSaveComplaints(complaints);
    refreshUI();
    adminShowUpdateMessage("Status updated successfully.", "success");
  });
}

document.addEventListener("DOMContentLoaded", adminInit);

