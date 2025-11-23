"use client";
import { useState } from "react";

export default function LinkForm({ onCreate }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function validate() {
    if (!url) return "URL is required";
    try {
      const u = new URL(url);
      if (!["http:", "https:"].includes(u.protocol))
        return "Use http:// or https://";
    } catch {
      return "Invalid URL";
    }
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code))
      return "Code must be 6-8 alphanumeric chars";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {}
      if (!res.ok) {
        if (res.status === 409) setError("Code already exists");
        else setError(data?.error || "Server error");
      } else {
        setUrl("");
        setCode("");
        onCreate && onCreate(data);
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-medium mb-3">Create Short Link</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Long URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            placeholder="https://example.com/long/url"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Custom Code (optional)</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            placeholder="6-8 chars"
          />
        </div>
      </div>
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        <button
          type="button"
          onClick={() => {
            setUrl("");
            setCode("");
            setError(null);
          }}
          className="px-4 py-2 bg-white hover:bg-gray-100 border rounded"
        >
          Reset
        </button>
      </div>
    </form>
  );
  <button
    id="add-link-btn"
    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
  >
    <i class="fas fa-plus"></i>
    <span>Add New Link</span>
  </button>;
}
