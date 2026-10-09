// Standalone Vercel serverless function - intentionally NOT part of the Astro
// app. Astro's SSR adapter bundles every route into one shared function, and
// that bundle has repeatedly broken on unrelated native dependencies (sharp,
// rolldown) that this endpoint doesn't even use. Anything under a root-level
// /api directory is built by Vercel independently of the Astro/Vite pipeline,
// so this stays simple and isolated. The rest of the site is a plain static
// build again (see astro.config.mjs).

const HUBSPOT_UPSERT_URL =
  "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const serviceKey = process.env.HUBSPOT_SERVICE_KEY;
  if (!serviceKey) {
    console.error("[HubSpot] HUBSPOT_SERVICE_KEY is not set.");
    response.status(500).json({ error: "Server misconfigured." });
    return;
  }

  const body = request.body ?? {};
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) {
    response.status(400).json({ error: "Email is required." });
    return;
  }

  const [firstname, ...rest] = (
    typeof body.name === "string" ? body.name.trim() : ""
  ).split(/\s+/);
  const lastname = rest.join(" ");

  const properties = { email };
  if (firstname) properties.firstname = firstname;
  if (lastname) properties.lastname = lastname;
  if (body.company) properties.company = body.company;
  if (body.companySize) properties.company_size = body.companySize;
  properties.plan_interest =
    (typeof body.selectedPlan === "string" && body.selectedPlan.trim()) ||
    "No plan selected";

  const hubspotResponse = await fetch(HUBSPOT_UPSERT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [{ idProperty: "email", id: email, properties }],
    }),
  });

  if (!hubspotResponse.ok) {
    console.error(
      "[HubSpot] Failed to upsert contact:",
      hubspotResponse.status,
      await hubspotResponse.text(),
    );
    response.status(502).json({ error: "Could not reach HubSpot." });
    return;
  }

  response.status(200).json({ ok: true });
}
