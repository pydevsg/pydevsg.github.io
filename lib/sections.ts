export const SECTIONS = [
  { id: "top", label: "hero", hint: "back to the boot sequence" },
  { id: "work", label: "work", hint: "jpmc · internships · books4u" },
  { id: "sudiviz", label: "sudiviz", hint: "the featured one" },
  { id: "projects", label: "projects", hint: "live from github" },
  { id: "writing", label: "writing", hint: "medium, occasionally" },
  { id: "events", label: "events", hint: "talks + hackathons" },
  { id: "gallery", label: "gallery", hint: "contact sheet" },
  { id: "about", label: "about", hint: "quiz · music · sports" },
  { id: "contact", label: "contact", hint: "socials" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
