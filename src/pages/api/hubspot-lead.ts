import type { APIRoute } from "astro";

export const prerender = false;

const HUBSPOT_UPSERT_URL =
  "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert";

type LeadPayload = {
  name?: string;
  email?: string;
  company?: string;
  companySize?: string;
  selectedPlan?: string;
};

export const POST: APIRoute = async ({ request }) => {
  const serviceKey = import.meta.env.HUBSPOT_SERVICE_KEY;
  if (!serviceKey) {
    console.error("[HubSpot] HUBSPOT_SERVICE_KEY is not set.");
    return new Response(JSON.stringify({ error: "Server misconfigured." }), {
      status: 500,
    });
  }

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
    });
  }

  const email = body.email?.trim();
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required." }), {
      status: 400,
    });
  }

  const [firstname, ...rest] = (body.name ?? "").trim().split(/\s+/);
  const lastname = rest.join(" ");

  const properties: Record<string, string> = { email };
  if (firstname) properties.firstname = firstname;
  if (lastname) properties.lastname = lastname;
  if (body.company) properties.company = body.company;
  if (body.companySize) properties.company_size = body.companySize;
  // Requires a custom contact property named "plan_interest" (single-line
  // text) in HubSpot - Settings > Properties - or this request 400s.
  properties.plan_interest = body.selectedPlan?.trim() || "No plan selected";

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
    return new Response(JSON.stringify({ error: "Could not reach HubSpot." }), {
      status: 502,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
