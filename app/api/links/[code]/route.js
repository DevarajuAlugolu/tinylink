import { query } from "../../../../lib/db.js";

async function resolveParams(maybeThenable) {
  if (!maybeThenable) return {};
  // if it's a thenable/promise, await it
  if (typeof maybeThenable.then === "function") {
    try {
      return await maybeThenable;
    } catch (e) {
      console.error("Error awaiting params thenable:", e);
      return {};
    }
  }
  return maybeThenable;
}

export async function GET(request, context) {
  try {
    const params = await resolveParams(context?.params);
    const code = params?.code;
    if (!code)
      return new Response(JSON.stringify({ error: "Missing code" }), {
        status: 400,
      });

    const r = await query(
      "SELECT code, url, clicks, created_at, last_clicked FROM links WHERE code=$1",
      [code]
    );
    if (r.rowCount === 0)
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify(r.rows[0]), { status: 200 });
  } catch (e) {
    console.error("GET /api/links/[code] error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await resolveParams(context?.params);
    const code = params?.code;
    if (!code)
      return new Response(JSON.stringify({ error: "Missing code" }), {
        status: 400,
      });

    const r = await query("DELETE FROM links WHERE code=$1 RETURNING code", [
      code,
    ]);
    if (r.rowCount === 0)
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error("DELETE /api/links/[code] error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
