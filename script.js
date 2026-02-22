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
  const input = document.getElementById("searchInput");


  if (!input) {
    console.log("Input not found");
    return;
  }

  console.log("INPUT VALUE RAW:", input.value);

  const query = input.value.trim();

  console.log("SEARCH QUERY:", query);

  if (!query && !initial) return;


  try {
    const response = await fetch("http://localhost:5678/webhook/papers", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error("Server responded with " + response.status);
    }

    const data = await response.json();

    console.log("RAW RESPONSE:", data);

    if (Array.isArray(data)) {
      currentResults = data;
    } else if (Array.isArray(data.papers)) {
      currentResults = data.papers;
    } else if (Array.isArray(data.data)) {
      currentResults = data.data;
    } else {
      currentResults = [];
      console.warn("Unexpected response format.");
    }

    console.log("FINAL RESULTS:", currentResults);

    showSection("results");
    renderResults();

  } catch (error) {
    console.error("Error fetching papers:", error);
    currentResults = [];
    renderResults();
  }
}

function renderResults() {
  const container = document.getElementById("results");
  container.innerHTML = "";

  currentResults.forEach(paper => {
    const card = document.createElement("div");
    card.className = "paper-card";

    const preview =
      paper.summary.length > 220
        ? paper.summary.slice(0, 220) + "..."
        : paper.summary;

    card.innerHTML = `
      <div class="paper-title toggle-summary">
        ${paper.title}
      </div>

      <div class="paper-summary preview">
        ${preview}
      </div>

      <div class="paper-summary full hidden">
        ${paper.summary}
      </div>

      <div class="card-actions">
        <span class="action-link save-btn">Save for Later</span>
        <span class="action-link read-btn">Read Paper</span>
        <span class="action-link toggle-btn">Read Summary</span>
      </div>
    `;

    // ---------- EVENTS ----------

    const full = card.querySelector(".full");
    const toggleBtn = card.querySelector(".toggle-btn");

    function toggleSummary() {
      full.classList.toggle("hidden");
      toggleBtn.textContent =
        full.classList.contains("hidden")
          ? "Read Summary"
          : "Hide Summary";

      if (window.MathJax) MathJax.typeset();
    }

    card.querySelector(".toggle-summary")
        .addEventListener("click", toggleSummary);

    toggleBtn.addEventListener("click", toggleSummary);

    card.querySelector(".save-btn")
        .addEventListener("click", () => savePaper(paper.id));

    card.querySelector(".read-btn")
        .addEventListener("click", () =>
          openPaper(paper.link, paper.id)
        );

    container.appendChild(card);
  });

  if (window.MathJax) MathJax.typeset();
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
function clearRecent() {
  localStorage.removeItem("recentPapers");
  renderRecent();
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

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      searchPapers();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchPapers();
      }
    });
  }
});

