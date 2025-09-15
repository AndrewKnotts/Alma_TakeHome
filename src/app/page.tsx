"use client";
import { useState } from "react";
import { leadSchema, VISA_OPTIONS } from "@/lib/validation";
import CountrySelect from "@/components/CountrySelect";

export default function PublicFormPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const visas = fd.getAll("visas").map(String);
    const data = {
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      email: String(fd.get("email") || ""),
      country: String(fd.get("country") || ""),
      linkedin: String(fd.get("linkedin") || ""),
      visas: visas as (typeof VISA_OPTIONS)[number][],
      notes: (String(fd.get("notes") || "") || undefined) as string | undefined,
    };

    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      setErr(parsed.error.issues.map(({ message }) => message).join(" • "));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      setSubmitted(true);
      form.reset();
      setResumeName(null);
    } catch (e: any) {
      setErr(e.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: "40px auto", textAlign: "center" }}>
        <img className="form-icon" src="assets/icon_form.svg" alt="" />
        <h2 style={{ marginTop: 20 }}>Thank You</h2>
        <p className="subtle">
          Your information was submitted to our team of immigration <br />
          attorneys. Expect an email from hello@tryrialma.ai.
        </p>
        <div style={{ marginTop: 16 }}>
          <a href="/">
            <button className="standard-button submit-button">Go Back to Homepage</button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-button">
        {/* <a href="/" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.3 }}>alma</a> */}
        <nav style={{ marginLeft: "auto" }}>
          <a href="/login">
            <button className="secondary">Admin</button>
          </a>
        </nav>
      </div>
      <div className="hero">
        <div className="hero-text">
          <img className="alma-icon" src="assets/icon_alma.svg" alt="" />
          <h1>
            Get An Assessment<br></br>Of Your Immigration Case
          </h1>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
        <form className="lead-form" onSubmit={onSubmit}>
          <div className="input-label">
            <img className="form-icon" src="assets/icon_form.svg" alt="" />
            <div className="form-header">Want to understand your visa options?</div>
            <div className="form-text">
              Submit the form below and our team of experienced attorneys will review your information and send a
              preliminary assessment of your case based on your goals.
            </div>
          </div>

          <div className="input-list">
            <div>
              <input name="firstName" required placeholder="First Name" />
            </div>
            <div>
              <input name="lastName" required placeholder="Last Name" />
            </div>
            <div>
              <input name="email" type="email" required placeholder="Email" />
            </div>
            <div>
              <CountrySelect name="country" />
            </div>
            <div>
              <input name="linkedin" type="url" required placeholder="Linkedin / Personal Website URL" />
            </div>
            <div>
              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                required
                className="sr-only-input"
                onChange={(e) => setResumeName(e.currentTarget.files?.[0]?.name ?? null)}
              />

              <label htmlFor="resume" className="upload-resume-btn">
                Upload Resume
              </label>
              <span
                className={`file-name ${resumeName ? "" : "muted"}`}
                aria-live="polite"
                title={resumeName ?? "No file selected"}
              >
                {resumeName ?? "No file selected"}
              </span>
            </div>
          </div>

          <div className="input-label">
            <img className="form-icon" src="assets/icon_dice.svg" alt="" />
            <div className="form-header">Visa categories of interest?</div>
          </div>

          <div>
            <div className="checkbox-row">
              {["O-1", "EB-1A", "EB-2 NIW", "I don't know"].map((v) => (
                <label key={v} style={{ display: "flex", gap: 8, alignItems: "center", margin: 0 }}>
                  <input className="visa-checkbox" type="checkbox" name="visas" value={v} /> {v}
                </label>
              ))}
            </div>
          </div>

          <div className="input-label">
            <img className="form-icon" src="assets/icon_heart.svg" alt="" />
            <div className="form-header">How can we help you?</div>
          </div>

          <div className="form-text-box">
            <textarea
              className="text-box"
              name="notes"
              rows={5}
              placeholder="What is your current status, and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa, or both? Are there any timeline considerations?"
            />
          </div>

          <div className="submit-and-error">
            <button className=" standard-button submit-button" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
            {err && <p style={{ color: "#b00020" }}>{err}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
