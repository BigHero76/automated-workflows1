console.log("JS LOADED");

let currentResults = [];

// Get elements ONCE
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Attach listeners ONCE
if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    console.log("BUTTON CLICKED");
    searchPapers();
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      console.log("ENTER PRESSED");
      searchPapers();
    }
  });
}

// FUNCTION BELOW — clean and pure
async function searchPapers(initial = false) {
  const input = document.getElementById("searchInput");

  if (!input) {
    console.log("Input not found");
    return;
  }

  const query = input.value.trim();
  console.log("SEARCH QUERY:", query);

  if (!query && !initial) return;

  try {
    const response = await fetch("http://localhost:5678/webhook/papers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error("Server responded with " + response.status);
    }

    const data = await response.json();
    console.log("RAW RESPONSE:", data);

    currentResults = Array.isArray(data.papers)
      ? data.papers
      : Array.isArray(data)
      ? data
      : [];

    showSection("results");
    renderResults();

  } catch (error) {
    console.error("Error fetching papers:", error);
  }
}
