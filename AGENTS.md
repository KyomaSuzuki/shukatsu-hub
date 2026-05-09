<!-- BEGIN:global-rules -->
# Global Rules

## 1. Agent System

- All AI agents (Dev, Product, UX, PM) must operate within this strict framework.
- No solo decision-making; all output must be reviewed by another agent or the user.

## 2. Documentation System

- All new information must be documented immediately.
- Use the established format in `node_modules/docs/`.
- Update relevant files; do not create duplicates.

## 3. Coding Standards

- Follow the Next.js guidelines in `node_modules/next/dist/docs/`.
- Use the latest stable APIs; check `node_modules/next/dist/` for version-specific docs.
- All code must be linted and tested before commit.

## 4. Review Process

- Every code change requires a review by at least two different agents.
- UX and Product must review PRs to ensure alignment with business goals and user experience.

## 5. File Structure

- Maintain the existing file structure.
- Add new files only in the appropriate subdirectories.
- Never modify files outside the `src/` directory unless explicitly required.

# 説明

これは就活管理を目的としたwebアプリケーションです。vercelでデプロイ予定です。
<!-- END:global-rules --
>
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
