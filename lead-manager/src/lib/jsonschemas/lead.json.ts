export const leadJsonSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    country: { type: "string", minLength: 1 },
    linkedin: { type: "string", format: "uri" },
    visas: {
      type: "array",
      uniqueItems: true,
      items: { type: "string", enum: ["O-1", "EB-1A", "EB-2 NIW", "I don't know"] },
      minItems: 1,
    },
    notes: { type: "string" },
    resumeDataUrl: { type: "string", format: "data-url" }, // used client-side for upload
  },
  required: ["firstName", "lastName", "email", "country", "linkedin", "visas", "resumeDataUrl"],
} as const;

export const leadUiSchema = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/firstName" },
    { type: "Control", scope: "#/properties/lastName" },
    { type: "Control", scope: "#/properties/email" },
    { type: "Control", scope: "#/properties/country", label: "Country of Citizenship" },
    { type: "Control", scope: "#/properties/linkedin", label: "LinkedIn / Website URL" },
    {
      type: "Control",
      scope: "#/properties/visas",
      options: { format: "checkbox" },
      label: "Visa categories of interest",
    },
    { type: "Control", scope: "#/properties/notes", options: { multi: true } },
    { type: "Control", scope: "#/properties/resumeDataUrl", label: "Resume / CV (PDF preferred)" },
  ],
} as const;
