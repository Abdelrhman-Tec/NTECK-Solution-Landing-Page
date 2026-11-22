import type { Locale } from "next-intl";

type LocalizedText = Record<Locale, string>;
type ProjectOwnership = "founder" | "studio" | "client";

export type ProjectImage = {
  src: `/work/${string}`;
  width: number;
  height: number;
  alt: LocalizedText;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  category: LocalizedText;
  ownership: ProjectOwnership;
  technologies: readonly string[];
  cover: ProjectImage;
  gallery?: readonly ProjectImage[];
  problem: LocalizedText;
  solution: LocalizedText;
  contribution?: LocalizedText;
  liveUrl?: string;
  published: boolean;
  approvedForPublication: boolean;
};

const projects: readonly PortfolioProject[] = [];

export function isPublicProject(project: PortfolioProject) {
  return project.published === true
    && project.approvedForPublication === true
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug);
}

export function getPublishedProjects() {
  return projects.filter(isPublicProject);
}

export function getPublishedProject(slug: string) {
  return projects.find((project) => project.slug === slug && isPublicProject(project));
}

export function getProjectLiveUrl(value: string | undefined) {
  if (!value || /[\s\\]/u.test(value) || !/^https:\/\//i.test(value)) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
