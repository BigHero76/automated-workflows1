console.log("JS LOADED");
const searchInput = document.getElementById("searchInput");

let currentResults = [];

function showSection(sectionId) {
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('saved-section').classList.add('hidden');
  document.getElementById('recent-section').classList.add('hidden');

  if (sectionId === 'results') {
    document.getElementById('results-section').classList.remove('hidden');
  } else if (sectionId === 'savedPapers') {
    document.getElementById('saved-section').classList.remove('hidden');
    renderSaved();
  } else if (sectionId === 'recentPapers') {
    document.getElementById('recent-section').classList.remove('hidden');
    renderRecent();
  }
}

async function searchPapers(initial = false) {
  const query = searchInput?.value?.trim() || "";

  if (!query && !initial) return;

  try {
    const response = await fetch("http://localhost:5678/webhook/papers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    console.log("BACKEND RESPONSE:", data);

    currentResults = data[0]?.json?.papers || [];
    showSection('results');
    renderResults();

  } catch (error) {
    console.error("Error fetching papers:", error);
  }
}

function renderResults() {
  const container = document.getElementById("results");
  container.innerHTML = "";

  currentResults.forEach(paper => {
    const card = document.createElement("div");
    card.className = "paper-card";

    card.innerHTML = `
      <div class="paper-title" onclick="openPaper('${paper.link}', '${paper.id}')">
        ${paper.title}
      </div>
      <div class="paper-summary">${paper.summary}</div>
      <div class="card-actions">
        <span class="action-link" onclick="savePaper('${paper.id}')">Save for Later</span>
        <span class="action-link" onclick="openPaper('${paper.link}', '${paper.id}')">Read Paper</span>
      </div>
    `;

    container.appendChild(card);
  });
}

function savePaper(paperId) {
  let saved = JSON.parse(localStorage.getItem("savedPapers")) || [];

  if (!saved.includes(paperId)) {
    saved.push(paperId);
    localStorage.setItem("savedPapers", JSON.stringify(saved));
  }
}

function renderSaved() {
  const savedIds = JSON.parse(localStorage.getItem("savedPapers")) || [];
  const container = document.getElementById("savedPapers");
  container.innerHTML = "";

  if (savedIds.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:#999;'>No papers saved yet.</p>";
    return;
  }

  savedIds.forEach(id => {
    const paper = currentResults.find(p => p.id === id);
    if (paper) {
      const card = document.createElement("div");
      card.className = "paper-card";

      card.innerHTML = `
        <div class="paper-title" onclick="openPaper('${paper.link}', '${paper.id}')">
          ${paper.title}
        </div>
        <div class="card-actions">
          <span class="action-link" onclick="removeSaved('${paper.id}')">Remove</span>
          <span class="action-link" onclick="openPaper('${paper.link}', '${paper.id}')">Read Paper</span>
        </div>
      `;

      container.appendChild(card);
    }
  });
}

function removeSaved(paperId) {
  let saved = JSON.parse(localStorage.getItem("savedPapers")) || [];
  saved = saved.filter(id => id !== paperId);
  localStorage.setItem("savedPapers", JSON.stringify(saved));
  renderSaved();
}

function openPaper(url, paperId) {
  let recent = JSON.parse(localStorage.getItem("recentPapers")) || [];

  recent = recent.filter(id => id !== paperId);
  recent.unshift(paperId);

  if (recent.length > 10) recent.pop();

  localStorage.setItem("recentPapers", JSON.stringify(recent));
  window.open(url, "_blank");
}

function renderRecent() {
  const recentIds = JSON.parse(localStorage.getItem("recentPapers")) || [];
  const container = document.getElementById("recentPapers");
  container.innerHTML = "";

  if (recentIds.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:#999;'>No recently read papers.</p>";
    return;
  }

  recentIds.forEach(id => {
    const paper = currentResults.find(p => p.id === id);
    if (paper) {
      const card = document.createElement("div");
      card.className = "paper-card";

      card.innerHTML = `
        <div class="paper-title" onclick="openPaper('${paper.link}', '${paper.id}')">
          ${paper.title}
        </div>
      `;

      container.appendChild(card);
    }
  });
}
