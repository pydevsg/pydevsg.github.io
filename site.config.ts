/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  site.config.ts — the only file you need to edit.
 *  Name, socials, work, events, gallery, blog fallbacks, accent colour.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Accent = "acid" | "magenta";
export type WorkTag = "infra" | "ui" | "data" | "oss";

export type WorkItem = {
  id: string;
  title: string;
  org: string;
  role: string;
  period: string;
  location: string;
  tags: WorkTag[];
  summary: string;
  bullets: string[];
};

export type EventItem = {
  id: string;
  name: string;
  talk: string;
  place: string;
  flag: string;
  when: string;
  status: "upcoming" | "past";
  url: string | null;
  /** Text on the outbound link, e.g. "recap". */
  urlLabel?: string;
  note: string;
  /** Photos from the room. Drop files in public/talks/ and reference them here. */
  photos?: { src: string; alt: string }[];
};

export type GalleryTile = {
  src: string | null;
  caption: string;
  roll: string;
};

export type BlogPost = {
  title: string;
  date: string;
  url: string;
  preview: string;
  image: string | null;
};

export type Repo = {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  updated: string;
};

export const site = {
  /** Swap to "magenta" to ship the hot-pink build instead. Visitors can still toggle. */
  accent: "acid" as Accent,

  url: "https://sudipto.dev",
  domain: "sudipto.dev",
  name: "Sudipto Ghosh",
  handle: "pydevsg",
  location: "London, UK",
  role: "Software Engineer II",
  company: "J.P. Morgan Chase",

  /** His voice. Do not sand these down. */
  tagline: "polyglot software engineer · cloud infra + ui at scale",
  subline: "shipping before GTA VI drops",
  sublineStates: ["hopefully", "maybe?", "probably", "fingers crossed", "soon™", "we'll see"],
  motto: "Code and contribute until the goal is reached",

  email: "sudiptoghosh1129@gmail.com",

  socials: [
    { key: "github", label: "github", handle: "pydevsg", url: "https://github.com/pydevsg" },
    { key: "linkedin", label: "linkedin", handle: "sudiptoghosh11", url: "https://www.linkedin.com/in/sudiptoghosh11/" },
    { key: "x", label: "x", handle: "jsdevsg", url: "https://x.com/jsdevsg" },
    { key: "medium", label: "medium", handle: "@jsdevsg", url: "https://medium.com/@jsdevsg" },
    { key: "youtube", label: "youtube", handle: "channel", url: "https://www.youtube.com/channel/UCPYGMYIfztwzk7RFK_vyj9g" },
  ],

  stack: ["python", "java", "typescript", "c++", "react", "terraform", "kubernetes", "aws"],

  certs: [
    { label: "AWS Certified Developer — Associate", short: "aws-dev-assoc" },
    { label: "HashiCorp Certified Terraform Associate", short: "terraform-assoc" },
  ],

  /** ─── Work rail. Chip filters read from `tags`. ─────────────────────────── */
  work: <WorkItem[]>[
    {
      id: "aisearch",
      title: "AiSearch",
      org: "J.P. Morgan Chase",
      role: "Software Engineer II",
      period: "now",
      location: "London",
      tags: ["data", "ui"] as WorkTag[],
      summary: "LLM-powered augmented search platform serving 100K+ external users.",
      bullets: [
        "cut analyst retrieval time by 85%",
        "retrieval + ranking pipeline in python",
        "search surface in react / typescript",
      ],
    },
    {
      id: "subscriptions",
      title: "Subscriptions Management",
      org: "J.P. Morgan Chase",
      role: "Software Engineer II",
      period: "now",
      location: "London",
      tags: ["infra"] as WorkTag[],
      summary: "Architected the infrastructure behind a portal handling 10M+ subscriptions.",
      bullets: [
        "10M+ subscriptions under management",
        "terraform-defined, reviewed like code",
        "designed for the boring kind of scale",
      ],
    },
    {
      id: "platform",
      title: "Multi-region EKS",
      org: "J.P. Morgan Chase",
      role: "Software Engineer II",
      period: "now",
      location: "London",
      tags: ["infra"] as WorkTag[],
      summary: "Runs Kubernetes on EKS across regions for production workloads.",
      bullets: [
        "multi-region failover",
        "aws developer associate + terraform associate",
        "on-call reality, not slideware",
      ],
    },
    {
      id: "findresearch",
      title: "FindResearch",
      org: "J.P. Morgan Chase",
      role: "Software Engineer II",
      period: "now",
      location: "London",
      tags: ["ui", "data"] as WorkTag[],
      summary: "Ships python risk / P&L services and the react + typescript UIs on top of them.",
      bullets: [
        "risk and P&L services in python",
        "react / typescript front ends",
        "full-stack, end to end",
      ],
    },
    {
      id: "rac",
      title: "Regulatory Action & Compliance",
      org: "J.P. Morgan Chase",
      role: "Software Engineer II",
      period: "now",
      location: "London",
      tags: ["data", "infra"] as WorkTag[],
      summary: "Building dashboards and MCP servers so compliance data answers its own questions.",
      bullets: [
        "dashboards for regulatory workflows",
        "MCP servers wiring tools to models",
      ],
    },
    {
      id: "sudiviz-work",
      title: "sudiviz",
      org: "open source",
      role: "author + maintainer",
      period: "now",
      location: "the internet",
      tags: ["oss", "infra"] as WorkTag[],
      summary: "X-ray vision for your cloud infrastructure. 13K+ downloads, presented at EuroSciPy 2026.",
      bullets: [
        "maps live aws infra as a graph",
        "catches misconfigs, orphans, terraform drift",
        "talks: euroscipy 2026 kraków · aws offices london",
      ],
    },
    {
      id: "publiclab",
      title: "Google Summer of Code — mentor",
      org: "Public Lab",
      role: "mentor",
      period: "2020 – 2022",
      location: "remote",
      tags: ["oss"] as WorkTag[],
      summary: "Mentored GSoC students at Public Lab across three consecutive summers.",
      bullets: [
        "gsoc mentor '20, '21, '22",
        "also part of outreachy '21 and google code-in '19",
      ],
    },
    {
      id: "books4u",
      title: "Books4U",
      org: "founder",
      role: "founder",
      period: "2018 – 2020",
      location: "Jalpaiguri, India",
      tags: ["ui", "data"] as WorkTag[],
      summary: "Second-hand college textbook marketplace. 25,000+ transactions, 10+ colleges, $100K revenue.",
      bullets: [
        "25,000+ transactions",
        "10+ colleges on the network",
        "$100K revenue before graduating",
      ],
    },
  ],

  /** ─── Featured project. ────────────────────────────────────────────────── */
  featured: {
    name: "sudiviz",
    repo: "pydevsg/sudiviz",
    url: "https://github.com/pydevsg/sudiviz",
    pypi: "https://pypi.org/project/sudiviz/",
    install: "pip install 'sudiviz[all]'",
    pitch: "X-ray vision for your cloud infrastructure.",
    blurb:
      "An open-source python CLI that maps live AWS infrastructure as an interactive graph — then tells you what's wrong with it. Misconfigs, orphaned resources, terraform drift.",
    features: [
      { comment: "Diagnose your infrastructure", cmd: "sudiviz diagnose" },
      { comment: "Explain findings in plain English (via Bedrock)", cmd: "sudiviz explain" },
      { comment: "Interactive web visualization", cmd: "sudiviz graph --output web --open" },
      { comment: "Auto-fix issues", cmd: "sudiviz fix --apply" },
    ],

    /** The agentic half of the CLI. */
    mcp: {
      title: "MCP server",
      tag: "agentic ai",
      blurb:
        "sudiviz ships an MCP server so AI agents (Claude Desktop, Claude Code, Cursor, etc.) can discover, diagnose and remediate your infrastructure via natural language.",
      install: "pip install 'sudiviz[mcp]'",
      commands: [{ comment: "Start the MCP server (stdio transport)", cmd: "sudiviz-mcp" }],
      clients: ["claude desktop", "claude code", "cursor"],
    },

    /** Wide screenshot used as a faint backdrop behind the slab. */
    backdrop: "/talks/sudiviz-graph-wide.png",
    /**
     * null → the built-in animated graph.
     * Drop a real recording in public/ and set this to e.g. "/sudiviz-demo.gif".
     */
    demo: null as string | null,
    badge: "presented at EuroSciPy 2026 · Kraków 🇵🇱",
    /** All-time downloads — pypistats only serves the trailing 30 days. Bump by hand. */
    downloadsAllTime: 13000,
    fallback: { lastMonth: 617, lastWeek: 41, stars: 8, forks: 1 },
  },

  /** Pinned to the front of the repo grid, in this order. */
  pinnedRepos: ["sudiviz", "meetify", "Bank-Filter-App"],

  /** Shown if api.github.com is rate-limited or down. Mirrors the live shape. */
  repoFallback: <Repo[]>[
    {
      name: "sudiviz",
      description: "X-ray vision for your cloud infrastructure",
      language: "Python",
      stars: 8,
      url: "https://github.com/pydevsg/sudiviz",
      updated: "2026-08-06",
    },
    {
      name: "meetify",
      description: "Video + chat streaming application to talk with anonymous person around the world :)",
      language: "JavaScript",
      stars: 6,
      url: "https://github.com/pydevsg/meetify",
      updated: "2024-01-01",
    },
    {
      name: "Bank-Filter-App",
      description: "Web application to search and list all the banks around multiple cities in India",
      language: "JavaScript",
      stars: 5,
      url: "https://github.com/pydevsg/Bank-Filter-App",
      updated: "2024-01-01",
    },
    {
      name: "Swasthya-Seva",
      description: "Swasthya Seva — Advanced Hospital Management System",
      language: "CSS",
      stars: 6,
      url: "https://github.com/pydevsg/Swasthya-Seva",
      updated: "2023-01-01",
    },
    {
      name: "ModelServeAI",
      description: "A robust, scalable, and observable platform for serving AI models as microservices",
      language: "Python",
      stars: 0,
      url: "https://github.com/pydevsg/ModelServeAI",
      updated: "2026-01-01",
    },
    {
      name: "CoWrite",
      description: "A simple collaborative text editor using Yjs",
      language: "TypeScript",
      stars: 0,
      url: "https://github.com/pydevsg/CoWrite",
      updated: "2026-01-01",
    },
  ],

  /** ─── Events / talks. Add a new one by appending here. ─────────────────── */
  events: <EventItem[]>[
    {
      id: "euroscipy-2026",
      name: "EuroSciPy 2026",
      talk: "sudiviz",
      place: "Kraków, Poland",
      flag: "🇵🇱",
      when: "jul 2026",
      status: "past" as const,
      url: "https://euroscipy.org/",
      urlLabel: "euroscipy.org",
      note: "selected to present sudiviz · 18–23 july",
      photos: [
        {
          src: "/talks/euroscipy-2026-poster.png",
          alt: "Sudipto presenting the sudiviz poster at EuroSciPy 2026 in Kraków",
        },
        {
          src: "/talks/euroscipy-2026-banner.png",
          alt: "EuroSciPy 2026 sponsor banner at the venue in Kraków",
        },
      ],
    },
    {
      id: "aws-offices-london",
      name: "AWS Offices",
      talk: "sudiviz",
      place: "London, UK",
      flag: "🇬🇧",
      when: "2026",
      status: "past" as const,
      url: "https://builder.aws.com/content/3HNHXzMNJGaWzA3g1SoscvXJb4I/sudiviz-x-ray-vision-for-cloud-infra-or-aws-waug-recap",
      urlLabel: "recap on aws builder center",
      note: "talked infra graphs with the people who build the infra",
      photos: [
        {
          src: "/talks/aws-waug-sudiviz.png",
          alt: "Sudipto presenting the 'What is sudiviz?' slide at the AWS offices in London",
        },
        {
          src: "/talks/sudiviz-graph-wide.png",
          alt: "The sudiviz interactive graph on two projector screens during the AWS talk",
        },
      ],
    },
  ],

  /** ─── Gallery. Drop files in public/gallery/ and point src at them. ────── */
  gallery: {
    /** "filmstrip" | "bento" */
    layout: "filmstrip" as "filmstrip" | "bento",
    tiles: <GalleryTile[]>[
      { src: "/talks/aws-waug-sudiviz.png", caption: "aws offices · london", roll: "A" },
      { src: "/talks/euroscipy-2026-poster.png", caption: "euroscipy 2026 · kraków", roll: "A" },
      { src: "/talks/euroscipy-2026-banner.png", caption: "the banner, kraków", roll: "A" },
      { src: "/talks/sudiviz-graph-wide.png", caption: "the graph, two screens", roll: "A" },
      { src: null, caption: "quiz night hardware", roll: "B" },
      { src: null, caption: "table tennis, contested", roll: "B" },
      { src: null, caption: "guitar, unamplified", roll: "B" },
      { src: null, caption: "books4u, jalpaiguri", roll: "C" },
      { src: null, caption: "london, 6am deploy", roll: "C" },
      { src: null, caption: "whiteboard, survived", roll: "C" },
    ],
  },

  /** ─── Blog. Live from Medium; this list is the graceful failure. ───────── */
  blog: {
    feed: "https://jsdevsg.medium.com/feed",
    profile: "https://medium.com/@jsdevsg",
    fallback: <BlogPost[]>[
      {
        title: "JPMorgan Chase Interview Experience — Code for Good Hackathon",
        date: "2020-10-30T09:15:41.000Z",
        url: "https://jsdevsg.medium.com/jpmorgan-chase-interview-experience-code-for-good-hackathon-44aa176a0d88",
        preview: "The hackathon that turned into a full-time offer, written up while it was still fresh.",
        image: "https://cdn-images-1.medium.com/max/800/1*TKSzCSqA3mV00PCbfkJZZQ.jpeg",
      },
      {
        title: "My voyage through Open Source",
        date: "2020-04-23T16:32:30.000Z",
        url: "https://jsdevsg.medium.com/my-voyage-through-open-source-222176246487",
        preview: "From first pull request to mentoring other people's first pull requests.",
        image: "https://cdn-images-1.medium.com/max/689/1*SK3rmX19ZLmEFVGHCYgbWQ.jpeg",
      },
      {
        title: "GSSoC 2019 : An anecdote",
        date: "2019-06-04T16:55:52.000Z",
        url: "https://jsdevsg.medium.com/gssoc-2019-an-anecdote-eaba7cb84406",
        preview: "A LinkedIn scroll in January, a summer of code by June.",
        image: "https://cdn-images-1.medium.com/max/960/1*POmfaKaInlg8RzzThEgjJA.png",
      },
    ],
  },

  /** ─── Off-code. ────────────────────────────────────────────────────────── */
  about: {
    line: "away from the terminal",
    body:
      "Competitive quizzer — the kind who argues about the answer after the buzzer. Plays table tennis with more confidence than backhand. Owns a guitar and, occasionally, plays it. Got this job through a hackathon, which is still the best deploy story he has.",
    /** icon ∈ trophy | ball | guitar (see components/About.tsx) */
    interests: [
      { icon: "trophy", label: "quizzing", note: "buzzer first, think later" },
      { icon: "ball", label: "table tennis", note: "forehand only, sadly" },
      { icon: "guitar", label: "guitar", note: "four chords, high conviction" },
    ],
  },

  /** Cmd+K joke commands. `action` is handled in components/CommandBar.tsx */
  jokeCommands: [
    { cmd: "whoami", out: "sudipto — software engineer ii, london. polyglot. mostly python." },
    { cmd: "sudo hire me", out: "permission denied: this is a portfolio, not a landing page." },
    { cmd: "cat resume.pdf", out: "%PDF-1.7 …binary garbage… (try linkedin instead)" },
    { cmd: "uptime", out: "up since 2018, load average: 3 workstreams, 1 cli, 0 regrets" },
    { cmd: "sl", out: "choo choo. no train here. use ls." },
  ],

  seo: {
    title: "Sudipto Ghosh — polyglot software engineer",
    description:
      "Software Engineer II at J.P. Morgan Chase in London. Cloud infra + UI at scale. Author of sudiviz — X-ray vision for your cloud infrastructure. Presenting at EuroSciPy 2026.",
    keywords: [
      "Sudipto Ghosh",
      "sudiviz",
      "software engineer",
      "J.P. Morgan Chase",
      "AWS",
      "Terraform",
      "Kubernetes",
      "London",
      "EuroSciPy 2026",
    ],
  },
};

export type Site = typeof site;
