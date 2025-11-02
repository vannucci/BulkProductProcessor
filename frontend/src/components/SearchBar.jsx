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
      // Query word_index for the search term (lowercase)
      const results = await pb.collection("word_index").getFullList({
        filter: `word = "${searchTerm.toLowerCase()}"`,
        expand: "products", // Expands the relation to get full product details
      });

      // Extract the products from the expanded relation
      const products = results
        .map((record) => record.expand?.products)
        .flat()
        .filter(Boolean); // Remove any null/undefined

      onResults(products, searchTerm);
    } catch (err) {
      console.error("Search failed:", err);
      onResults([], searchTerm);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by word (e.g., granite, soap, wooden)"
          style={{
            flex: 1,
            padding: "0.75rem",
            fontSize: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
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
