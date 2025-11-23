import { query } from "../../lib/db.js";

async function resolveParams(maybeThenable) {
  if (!maybeThenable) return {};
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
    console.log("redirect GET for code:", code);

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // fetch the target url
    const r = await query("SELECT url FROM links WHERE code=$1", [code]);
    console.log("select result rowCount:", r.rowCount);
    if (r.rowCount === 0) {
      return new Response("Not found", { status: 404 });
    }

    const url = r.rows[0].url;
    console.log("redirecting to url:", url);

    // increment clicks and update last_clicked
    await query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code=$1",
      [code]
    );

    return Response.redirect(url, 302);
  } catch (e) {
    console.error("GET /[code] error:", e);
    return new Response("Server error", { status: 500 });
  }
}
