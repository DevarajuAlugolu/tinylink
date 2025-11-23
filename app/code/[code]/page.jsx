"use client";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";

const fetcher = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Fetch error");
    return r.json();
  });

export default function StatsPage() {
  const params = useParams();
  const code = params?.code;
  const { data, error } = useSWR(code ? `/api/links/${code}` : null, fetcher);
  const router = useRouter();

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Link Stats</h2>
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 border rounded"
        >
          Back
        </button>
      </div>

      {!code && <div>Loading...</div>}
      {error && <div className="text-red-600">Not found or server error</div>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500">Short Code</div>
            <div className="font-medium text-lg">{data.code}</div>

            <div className="text-sm text-slate-500 mt-3">Short Link</div>
            <div className="mt-1">
              {typeof window !== "undefined" && window.location.origin}/
              {data.code}
            </div>

            <div className="text-sm text-slate-500 mt-3">Target URL</div>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 block truncate w-full"
              title={data.url}
            >
              {data.url}
            </a>
          </div>

          <div>
            <div className="text-sm text-slate-500">Clicks</div>
            <div className="text-2xl font-semibold">{data.clicks}</div>

            <div className="text-sm text-slate-500 mt-3">Last Clicked</div>
            <div className="mt-1">
              {data.last_clicked
                ? new Date(data.last_clicked).toLocaleString()
                : "-"}
            </div>

            <div className="text-sm text-slate-500 mt-3">Created At</div>
            <div className="mt-1">
              {new Date(data.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
