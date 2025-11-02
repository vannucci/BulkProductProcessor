import { useState, useEffect } from "react";
import { pb } from "../lib/pocketbase";
import SearchBar from "./SearchBar";
import FileUpload from "./FileUpload";
import FilesView from './FilesView'

function ProductsView() {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInfo, setSearchInfo] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const records = await pb.collection("products").getFullList({
        sort: "-created",
      });
      setProducts(records);
      setDisplayProducts(records);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchResults(results, searchTerm) {
    if (!searchTerm.trim()) {
      clearSearch();
      return;
    }
    setDisplayProducts(results);
    setSearchInfo({ term: searchTerm, count: results.length });
  }

  function clearSearch() {
    setDisplayProducts(products);
    setSearchInfo(null);
  }

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <SearchBar onResults={handleSearchResults} />

      {searchInfo ? (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "#e7f3ff",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            Found <strong>{searchInfo.count}</strong> product(s) matching "
            <strong>{searchInfo.term}</strong>"
          </span>
          <button
            onClick={clearSearch}
            style={{
              padding: "0.25rem 0.75rem",
              background: "white",
              border: "1px solid #007bff",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#007bff",
            }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <h2>All Products ({products.length})</h2>
      )}

      <FileUpload
        onUploadComplete={(record) => {
          console.log("File uploaded:", record);
          // Later we'll refresh the files list here
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Product Name
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Price
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                style={{ padding: "2rem", textAlign: "center", color: "#666" }}
              >
                No products found
              </td>
            </tr>
          ) : (
            displayProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.75rem" }}>{product.name}</td>
                <td style={{ padding: "0.75rem" }}>${product.price}</td>
                <td style={{ padding: "0.75rem" }}>{product.department}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <FilesView />
    </div>
  );
}

export default ProductsView;
