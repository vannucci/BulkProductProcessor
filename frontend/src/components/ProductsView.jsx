import { useState, useEffect } from "react";
import { pb } from "../lib/pocketbase";

function ProductsView({ user, searchResults, isSearching }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadProducts();

    pb.collection("products").subscribe("*", () => {
      loadProducts();
    });

    return () => pb.collection("products").unsubscribe();
  }, [user]);

  async function loadProducts() {
    try {
      const records = await pb.collection("products").getFullList({
        sort: "-created",
      });
      setProducts(records);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading products...</div>;
  }

  const displayProducts = isSearching ? searchResults : products;

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed", // Prevents stretching
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
                width: "100px", // Fixed width for price
              }}
            >
              Price
            </th>
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
                width: "150px", // Fixed width for category
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
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#666",
                  height: "auto", // Don't stretch
                }}
              >
                {isSearching ? "No products found" : "No products yet"}
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
    </div>
  );
}

export default ProductsView;
