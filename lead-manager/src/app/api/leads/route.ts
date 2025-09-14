import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadSchema } from "@/lib/validation";
import { v4 as uuid } from "uuid";
import type { ZodIssue } from "zod";

export async function GET() {
  return NextResponse.json(db.list());
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const firstName = String(form.get("firstName") || "");
  const lastName = String(form.get("lastName") || "");
  const email = String(form.get("email") || "");
  const linkedin = String(form.get("linkedin") || "");
  const country = String(form.get("country") || "");
  const visas = form.getAll("visas").map(String); // multiple
  const notes = String(form.get("notes") || "") || undefined;

  const parsed = leadSchema.safeParse({ firstName, lastName, email, linkedin, country, visas, notes });
if (!parsed.success) {
  const msg = parsed.error.issues.map((i: ZodIssue) => i.message).join(" • ");
  return new NextResponse(msg, { status: 400 });
}

  let resume: any = undefined;
  const file = form.get("resume");
  if (file && typeof file === "object" && "arrayBuffer" in file) {
    const f = file as File;
    const buf = Buffer.from(await f.arrayBuffer());
    resume = { filename: f.name, mime: f.type || "application/octet-stream", base64: buf.toString("base64") };
  } else {
    return new NextResponse("Resume file is required", { status: 400 });
  }

  db.add({
    id: uuid(),
    firstName,
    lastName,
    email,
    linkedin,
    country,
    visas,
    notes,
    resume,
    state: "PENDING",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const body = await req.json().catch(() => ({}));
  const state = body?.state;
  if (state !== "REACHED_OUT" && state !== "PENDING") return new NextResponse("Invalid state", { status: 400 });
  db.updateState(id, state);
  return NextResponse.json({ ok: true });
}
