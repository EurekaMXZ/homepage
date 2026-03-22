import type { SiteConfig } from "../types";

export const siteConfig = {
  metadata: {
    title: "EurekaMXZ | Home Page",
    description: "EurekaMXZ's home page",
  },
  profile: {
    semanticName: "EurekaMXZ",
    avatar: "https://blog-static.eurekamxz.me/images/avatar.jpg",
    bio: "Some birds are not meant to be caged, their feathers are just too bright.",
    email: "eurekamxz@gmail.com",
  },
  theme: {
    backgroundIntervalMs: 10000,
  },
  clock: {
    label: "Shanghai",
    timeZone: "Asia/Shanghai",
  },
  footer: {
    prefix: "Background",
  },
  github: {
    apiBaseUrl: "https://api.github.com",
    cacheKey: "projects-data",
    cacheTtlMs: 60 * 60 * 1000,
  },
} satisfies SiteConfig;
