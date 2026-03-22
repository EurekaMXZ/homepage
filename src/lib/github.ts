import { siteConfig } from '../config/site'
import type { ProjectCardData, ProjectConfig, ProjectMeta } from '../types'

interface CachedProjectMeta extends ProjectMeta {
  time: number
}

function readCache(): Record<string, CachedProjectMeta> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(siteConfig.github.cacheKey)
    return raw ? (JSON.parse(raw) as Record<string, CachedProjectMeta>) : {}
  } catch {
    return {}
  }
}

function writeCache(cache: Record<string, CachedProjectMeta>) {
  window.localStorage.setItem(siteConfig.github.cacheKey, JSON.stringify(cache))
}

function cleanExpiredCache(cache: Record<string, CachedProjectMeta>) {
  const now = Date.now()

  for (const key of Object.keys(cache)) {
    if (now - (cache[key]?.time ?? 0) > siteConfig.github.cacheTtlMs) {
      delete cache[key]
    }
  }

  return cache
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: value >= 1000 ? 2 : 0,
  }).format(value)
}

function mergeProjects(
  projects: ProjectConfig[],
  cache: Record<string, CachedProjectMeta>,
): ProjectCardData[] {
  return projects.map((project) => ({
    ...project,
    meta: cache[project.repo]
      ? {
          description: cache[project.repo].description,
          stargazerCount: cache[project.repo].stargazerCount,
          forkCount: cache[project.repo].forkCount,
        }
      : undefined,
  }))
}

async function fetchFromGitHubApi(repo: string): Promise<ProjectMeta> {
  const response = await fetch(`${siteConfig.github.apiBaseUrl}/repos/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed for ${repo}`)
  }

  const payload = (await response.json()) as {
    description: string | null
    stargazers_count: number
    forks_count: number
  }

  return {
    description: payload.description ?? undefined,
    stargazerCount: payload.stargazers_count,
    forkCount: payload.forks_count,
  }
}

export async function resolveProjectCards(projects: ProjectConfig[]) {
  const cache = cleanExpiredCache(readCache())
  writeCache(cache)

  let resolvedProjects = mergeProjects(projects, cache)
  const missing = resolvedProjects.filter((project) => !project.meta)

  if (missing.length === 0) {
    return resolvedProjects
  }

  const now = Date.now()
  await Promise.all(
    missing.map(async (project) => {
      try {
        cache[project.repo] = {
          time: now,
          ...(await fetchFromGitHubApi(project.repo)),
        }
      } catch {
        // Keep the card visible even if the request fails or is rate-limited.
      }
    }),
  )

  writeCache(cache)
  resolvedProjects = mergeProjects(projects, cache)
  return resolvedProjects
}
