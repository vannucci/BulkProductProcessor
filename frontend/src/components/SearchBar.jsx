import { useState } from "react";
import { pb } from "../lib/pocketbase";

function SearchBar({ onResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) {
      onResults([], "");
      return;
    }

    setLoading(true);
    try {
      const results = await pb.collection("word_index").getFullList({
        filter: `word = "${searchTerm.toLowerCase()}"`,
        expand: "products",
      });

      const products = results
        .map((record) => record.expand?.products)
        .flat()
        .filter(Boolean);

      onResults(products, searchTerm);
    } catch (err) {
      console.error("Search failed:", err);
      onResults([], searchTerm);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setSearchTerm("");
    onResults([], "");
  }

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", position: "relative" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by word (e.g., granite, soap, wooden)"
            style={{
              width: "100%",
              padding: "0.75rem",
              paddingRight: searchTerm ? "2.5rem" : "0.75rem", // Make room for X
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#666",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f0f0f0";
                e.target.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "none";
                e.target.style.color = "#666";
              }}
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !searchTerm.trim()}
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;