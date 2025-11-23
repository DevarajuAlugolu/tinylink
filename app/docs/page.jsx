"use client";
import { useState } from "react";

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="ml-2 inline-flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 rounded-md border hover:bg-slate-200 transition"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"
        />
        <rect
          x="9"
          y="9"
          width="11"
          height="11"
          rx="2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function MethodBadge({ method }) {
  const base =
    "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded";
  if (method === "POST")
    return <span className={`${base} bg-green-600 text-white`}>POST</span>;
  if (method === "DELETE")
    return <span className={`${base} bg-red-600 text-white`}>DELETE</span>;
  if (method === "GET")
    return <span className={`${base} bg-blue-600 text-white`}>GET</span>;
  return (
    <span className={`${base} bg-slate-200 text-slate-800`}>{method}</span>
  );
}

function Endpoint({
  id,
  method,
  path,
  description,
  curl,
  js,
  responseExample,
  notes,
}) {
  return (
    <section id={id} className="bg-white border rounded-lg shadow-sm p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <MethodBadge method={method} />
            <h3 className="text-lg font-semibold">{path}</h3>
            <CopyButton text={path} label={`Copy path ${path}`} />
          </div>
          {description && <p className="mt-2 text-slate-600">{description}</p>}
        </div>

        <div className="text-sm text-slate-500 md:text-right">
          <div>Response</div>
          <div className="mt-1 font-medium">application/json</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-2">cURL</div>
          <div className="relative bg-slate-900 text-white rounded">
            <pre className="p-3 text-sm overflow-x-auto">{curl}</pre>
            {/* <div className="absolute top-2 right-2 text-black">
              <CopyButton text={curl} label="Copy curl" />
            </div> */}
          </div>
        </div>
      </div>

      {responseExample && (
        <div className="mt-4">
          <div className="text-xs text-slate-500 mb-2">Example response</div>
          <div className="bg-slate-50 border rounded p-3">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(responseExample, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {notes && <p className="mt-3 text-sm text-slate-600">{notes}</p>}
    </section>
  );
}

export default function DocsPage() {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const endpoints = [
    {
      id: "create",
      method: "POST",
      path: "/api/links",
      description:
        "Create a short link. Provide a JSON body with `url` (required) and optional `code` (6–8 alphanumeric).",
      curl: `curl -X POST ${base}/api/links -H "Content-Type: application/json" -d '{"url":"https://example.com","code":"abc123"}'`,
      js: `await fetch('${base}/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: 'https://example.com', code: 'abc123' }) })`,
      responseExample: {
        code: "abc123",
        url: "https://example.com",
        clicks: 0,
        created_at: "2025-11-23T00:00:00Z",
        last_clicked: null,
      },
      notes: "Returns 201 on success. If code exists returns 409.",
    },
    {
      id: "list",
      method: "GET",
      path: "/api/links",
      description:
        "List all links (code, url, clicks, created_at, last_clicked).",
      curl: `curl ${base}/api/links`,
      js: `await fetch('${base}/api/links').then(r=>r.json())`,
      responseExample: [
        {
          code: "abc123",
          url: "https://example.com",
          clicks: 2,
          created_at: "2025-11-23T00:00:00Z",
          last_clicked: "2025-11-23T06:00:00Z",
        },
      ],
    },
    {
      id: "single",
      method: "GET",
      path: "/api/links/:code",
      description: "Get a single link stats by code.",
      curl: `curl ${base}/api/links/abc123`,
      js: `await fetch('${base}/api/links/abc123').then(r=>r.json())`,
      responseExample: {
        code: "abc123",
        url: "https://example.com",
        clicks: 2,
        created_at: "2025-11-23T00:00:00Z",
        last_clicked: "2025-11-23T06:00:00Z",
      },
    },
    {
      id: "delete",
      method: "DELETE",
      path: "/api/links/:code",
      description:
        "Delete a short link by code. After deletion /:code returns 404.",
      curl: `curl -X DELETE ${base}/api/links/abc123`,
      js: `await fetch('${base}/api/links/abc123', { method: 'DELETE' })`,
      responseExample: { ok: true },
      notes: "Returns 404 if code not found.",
    },
    {
      id: "redirect",
      method: "GET",
      path: "/:code",
      description: "Redirects to the original URL (302) and increments clicks.",
      curl: `curl -L ${base}/abc123`,
      js: `// open in browser\nwindow.location.href='${base}/abc123'`,
      responseExample: null,
      notes: "Visiting the short URL performs a 302 redirect.",
    },
    {
      id: "health",
      method: "GET",
      path: "/healthz",
      description: "Health check endpoint.",
      curl: `curl ${base}/healthz`,
      js: `await fetch('${base}/healthz').then(r=>r.json())`,
      responseExample: { ok: true, version: "1.0" },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">TinyLink API Documentation</h1>
          <p className="mt-2 text-slate-600">
            Simple, clear reference for the TinyLink assignment endpoints.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-slate-700 border">
              Base URL:{" "}
              <code className="ml-2 text-xs bg-white px-1 rounded">{base}</code>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-slate-700 border">
              <strong>Auth:</strong> none (public)
            </div>
          </div>
        </div>

        <div>
          {endpoints.map((ep) => (
            <Endpoint
              key={ep.id}
              id={ep.id}
              method={ep.method}
              path={ep.path}
              description={ep.description}
              curl={ep.curl}
              js={ep.js}
              responseExample={ep.responseExample}
              notes={ep.notes}
            />
          ))}
        </div>

        <div className="mt-6 text-sm text-slate-500">
          <strong>Note:</strong> Make sure you ran migrations (see README) and
          started the app before trying endpoints.
        </div>
      </div>
    </div>
  );
}
