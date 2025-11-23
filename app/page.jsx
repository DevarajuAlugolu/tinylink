"use client";
import LinkForm from "../components/LinkForm";
import LinkTable from "../components/LinkTable";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Fetch error");
    return r.json();
  });

export default function Dashboard() {
  const { data, error, mutate } = useSWR("/api/links", fetcher);

  async function handleCreate() {
    mutate();
  }

  async function handleDelete(code) {
    if (!confirm(`Delete ${code}?`)) return;
    await fetch(`/api/links/${code}`, { method: "DELETE" });
    mutate();
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <LinkForm onCreate={handleCreate} />
        </div>
        <div className="w-full">
          {error && <div className="text-red-600">Failed to load links</div>}
          {!data && !error && (
            <div className="bg-white p-4 rounded shadow">Loading...</div>
          )}
          {data && (
            <LinkTable
              links={data}
              onDelete={handleDelete}
              onOpenStats={(code) => {
                window.location.href = `/code/${code}`;
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
