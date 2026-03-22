import type { ProjectConfig } from "../types";

export const projects = [
  {
    name: "linux",
    repo: "torvalds/linux",
    primaryLanguage: {
      name: "C",
    },
  },
  {
    name: "codex",
    repo: "openai/codex",
    primaryLanguage: {
      name: "Rust",
    },
  },
  {
    name: "vscode",
    repo: "microsoft/vscode",
    desc: "Powerful open source editor",
    primaryLanguage: {
      name: "TypeScript",
    },
    descOverride: true,
  },
] satisfies ProjectConfig[];
