# Publishing a portfolio project

1. Confirm permission to publish the project, its screenshots, and any client names or branding. Remove personal data, private dashboards, credentials, and confidential information before saving assets. Files under `public/` are directly accessible, including assets for drafts.
2. Put approved screenshots under `public/work/<slug>/`. Use descriptive filenames and record each image's actual width, height, and useful Arabic and English alternative text.
3. Add a `PortfolioProject` record to `src/data/projects.ts`. Use a unique ID and a unique lowercase slug with hyphens. Fill in both languages for the title, summary, category, problem, solution, and contribution when relevant. Set ownership to founder, studio, or client based on the actual engagement. Include only technologies used and an optional verified HTTPS project URL.
4. Set `approvedForPublication` to true after approval, then set `published` to true once ready to release. Rebuild and verify the card at `/ar#work` and `/en#work` and the corresponding `/ar/work/<slug>` and `/en/work/<slug>` pages.
