"use client";

import { MdContentCopy } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { useRef, useState } from "react";

export default function LinkTable({ links = [], onDelete, onOpenStats }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";

  const [toast, setToast] = useState(null); // { message: string, key: string }
  const toastTimer = useRef(null);

  function showToast(message, key = "default") {
    // ensure we replace same-key to avoid stacking duplicates
    clearTimeout(toastTimer.current);
    setToast({ message, key });
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }

  async function handleCopy(text, code) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied", code);
    } catch {
      showToast("Copy failed", code);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-lg font-medium mb-3">Links</h2>
      {links.length === 0 ? (
        <div className="text-slate-600">No links found. Create one above.</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Toast (top center) */}
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center"
          >
            <div
              className={`transform transition-all duration-300 ${
                toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <div className="bg-black/85 text-white px-4 py-2 rounded-md shadow-md text-sm">
                {toast?.message}
              </div>
            </div>
          </div>
          {/* ------------------- */}

          <table className="w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-2">Code</th>
                <th className="p-2">Target URL</th>
                <th className="p-2">Clicks</th>
                <th className="p-2">Last Clicked</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.code} className="border-t">
                  <td className="p-2 align-top">
                    <div className="font-medium">{link.code}</div>
                    <div className="text-xs text-slate-500">
                      {base}/{link.code}
                    </div>
                  </td>
                  <td className="p-2 align-top max-w-xs">
                    <div className="truncate w-72" title={link.url}>
                      {link.url}
                    </div>
                  </td>
                  <td className="p-2 align-top">{link.clicks}</td>
                  <td className="p-2 align-top">
                    {link.last_clicked
                      ? new Date(link.last_clicked).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-2 align-top flex gap-2">
                    <button
                      onClick={
                        () => handleCopy(`${base}/${link.code}`, link.code)

                        // {
                        // navigator.clipboard?.writeText(`${base}/${link.code}`);
                        // }
                      }
                      className="px-2 py-1 bg-white hover:bg-gray-100 border rounded"
                    >
                      <MdContentCopy />
                    </button>
                    <button
                      onClick={() => onOpenStats(link.code)}
                      className="px-2 py-1  bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      <IoStatsChart />
                    </button>
                    <button
                      onClick={() => onDelete(link.code)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      <MdDelete />
                    </button>

                    <button
                      onClick={() =>
                        window.open(`${base}/${link.code}`, "_blank")
                      }
                      className="px-2 py-1 bg-white hover:bg-gray-100 border rounded"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
