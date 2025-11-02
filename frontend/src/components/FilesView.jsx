import { useState, useEffect } from "react";
import { pb } from "../lib/pocketbase";

function FilesView() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      const records = await pb.collection("files").getFullList({
        sort: "-created",
      });
      setFiles(records);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartProcessing(fileId) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8090/api/files/process/${fileId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`✅ Processed ${data.processed} rows from ${data.filename}`);
        loadFiles(); // Refresh the files list
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      alert(`❌ Failed to process: ${err.message}`);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "processing":
        return "#17a2b8";
      case "complete":
        return "#28a745";
      case "error":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "complete":
        return "✅";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  }

  if (loading) {
    return <div>Loading files...</div>;
  }

  return (
    <div style={{ marginTop: "3rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Import Files ({files.length})</h2>
        <button
          onClick={loadFiles}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {files.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            background: "#f8f9fa",
            borderRadius: "4px",
            color: "#666",
          }}
        >
          No files found. Drop CSV files into the import_files/ folder.
        </div>
      ) : (
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
                Status
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Filename
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Rows
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Hash
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.75rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      background: getStatusColor(file.status) + "20",
                      color: getStatusColor(file.status),
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    {getStatusIcon(file.status)} {file.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem", fontFamily: "monospace" }}>
                  {file.filename}
                </td>
                <td style={{ padding: "0.75rem" }}>{file.row_count || 0}</td>
                <td
                  style={{
                    padding: "0.75rem",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    color: "#666",
                  }}
                >
                  {file.file_hash.substring(0, 8)}...
                </td>
                <td style={{ padding: "0.75rem" }}>
                  {file.status === "pending" && (
                    <button
                      onClick={() => handleStartProcessing(file.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      ▶️ Start Processing
                    </button>
                  )}
                  {file.status === "error" && file.error_message && (
                    <span style={{ color: "#dc3545", fontSize: "0.85rem" }}>
                      {file.error_message}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FilesView;
