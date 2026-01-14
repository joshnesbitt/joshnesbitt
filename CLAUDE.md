# CLAUDE.md

This file contains preferences and context for Claude Code sessions.

## Project Overview

Personal website for Josh Nesbitt built with Astro.

## Design System

### Color Palette

- Background: `#FFFFFF` (white)
- Text: `#000103` (near black)
- Primary/Highlight: `#46FF10` (bright green) - use `text-brand-highlight` in Tailwind
- Secondary text: use `text-gray-500` in Tailwind
- Borders/Spacers: use `border-gray-200` in Tailwind

### Theme

This is a **light theme** site. Never use white or light-colored text (e.g., `rgba(255, 255, 255, ...)`). Always use dark colors for text that contrast against the white background.

### Typography

- Font family: DM Sans (`font-body`, `font-heading`)
- Base weight: `font-light` - avoid adding explicit font weights unless necessary
- Container text size: `text-xl sm:text-2xl` - inherit this for body content
- Secondary/meta text: `text-base sm:text-lg` for smaller text relative to container

### CSS Conventions

- Prefer Tailwind utility classes over custom SCSS styles
- Component classes use `c-` prefix (e.g., `.c-heading`, `.c-link-list`) - defined in `src/styles/application.scss`
- BEM-style naming for modifiers (e.g., `.c-heading--highlight`)

## Content

- Thoughts (blog posts) are stored in `src/content/thought/` as Markdown files
- Frontmatter includes: `title`, `description`, `pubDate`, and optional `published` (defaults to true)
