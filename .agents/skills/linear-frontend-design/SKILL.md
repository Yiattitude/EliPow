---
name: linear-frontend-design
description: Defines the Elipow frontend design system in a Linear-inspired product style: calm dark UI, dense layouts, precise hierarchy, subtle motion, keyboard-friendly workflows, and traceable learning surfaces. Use when designing, implementing, reviewing, or refactoring Elipow frontend pages, components, layouts, themes, or interactions.
---

# Linear Frontend Design

Use this skill for every Elipow frontend change. It turns the product into a focused learning workspace inspired by Linear: quiet, fast, precise, information-dense, and interaction-led.

## Product Fit

- Elipow is a learning assistant, not a marketing website. The first screen should be an actual workspace: learning path, graph, profile, sources, or Socratic QA.
- Learning path and learner state are primary. QA panels are secondary tools that reuse graph/resources.
- AI output must look structured and traceable: current level, gap, next step, source chips, and Socratic prompts. Do not design free-form chatbot-first screens.
- Keep the V1 Single-Agent constraint visible in the UI language. Avoid multi-agent metaphors, routing dashboards, or "agent swarm" visuals.

## Visual Direction

- Favor Linear-style calm precision over cyberpunk, glassmorphism, neon glow, or decorative gradients.
- Dark mode is the default, but it should feel matte and readable: charcoal backgrounds, warm gray surfaces, thin borders, restrained accents.
- Use color sparingly for state and progress. Accent colors should identify action, focus, mastery, risk, and source status.
- Cards have small radius, usually 6px to 8px. Avoid nested cards and floating decorative panels.
- Prefer real interface density: compact rows, split panes, tables, timelines, sidebars, inspectors, command menus, and status chips.

## Design Tokens

Use these as the default palette when introducing or revising theme variables.

```css
:root {
  --background: 240 8% 6%;
  --foreground: 0 0% 93%;
  --card: 240 7% 8%;
  --card-foreground: 0 0% 93%;
  --popover: 240 7% 9%;
  --popover-foreground: 0 0% 93%;
  --primary: 252 83% 67%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 5% 13%;
  --secondary-foreground: 0 0% 89%;
  --muted: 240 5% 12%;
  --muted-foreground: 240 5% 61%;
  --accent: 202 80% 55%;
  --accent-foreground: 0 0% 100%;
  --border: 240 5% 16%;
  --input: 240 5% 16%;
  --ring: 252 83% 67%;
  --radius: 0.5rem;
}
```

Implementation notes:

- Background: `#0f0f12` or close. Surface: `#151518` / `#1b1b20`. Border: `#2a2a31`.
- Text: primary near `#ededee`, secondary near `#a0a0aa`, tertiary near `#70707a`.
- Accent: restrained violet or blue. Use amber only for risk/gap warnings and green only for mastery/unlocked states.
- Remove radial gradient backgrounds, neon text glows, heavy blur, and broad translucent glass unless a modal backdrop needs blur.
- Use one type system: Inter, Geist, or system sans. For metrics, use tabular numeric variants or a mono font sparingly.

## Layout Patterns

- App shell: left rail or sidebar, top command/status bar, central workspace, right inspector drawer.
- Dashboard: dense overview with a learning path timeline, current objective, mastery/gap list, and source-backed next actions.
- Knowledge graph: full-bleed canvas with compact controls, semantic zoom, and a right-side node inspector. Keep graph controls anchored and predictable.
- Socratic QA: panel or drawer, not the dominant page. Show prompt, learner response input, hints, source chips, and "next question" structure.
- Settings/profile: use forms, segmented controls, toggles, and compact grouped sections. Avoid marketing-style feature cards.

## Component Rules

- Buttons: compact, icon-first when obvious, text+icon for primary commands. Use `lucide-react` icons.
- Navigation: active state is subtle filled surface plus clear text contrast. Avoid large glowing active states.
- Progress: use timelines, bars, small badges, and node states. Label progress with concrete learning terms, not vague gamification.
- Sources: render as small traceable chips with resource title, node id, or lesson mapping. Source UI must be visible near AI guidance.
- Forms: align labels and inputs cleanly. Validation copy should be direct and short.
- Empty/loading states: skeleton rows and reserved layout areas. Avoid spinner-only blank screens.
- Motion: 120-220ms transitions, ease-out, opacity/transform only. Use motion to clarify state changes, not to entertain.

## Copy Tone

- Use concise Chinese product UI copy by default.
- Prefer task verbs: `继续学习`, `查看来源`, `确认周计划`, `重新测评`, `锁定上下文`.
- AI guidance copy must be Socratic: ask the learner to compare, infer, calculate, or identify the next step. Do not reveal final answers as the default state.

## Frontend Stack Expectations

- React + Vite + TypeScript.
- Tailwind theme tokens should drive colors, radius, and borders.
- Use Zustand for session, graph focus, and UI state shared across panels.
- Use `@xyflow/react` for high-interaction learning path flows.
- Use AntV G6 for large graph exploration.
- Use `motion` only for purposeful micro-interactions.

## Required Review Before Finishing

- Check that the screen reads as a professional productivity app, not a sci-fi landing page.
- Check responsive behavior at desktop and mobile widths.
- Ensure text does not overlap, truncate badly, or resize layout unexpectedly.
- Ensure source/chip UI exists wherever AI claims or guidance appear.
- Ensure loading states reserve space and dashboard data is not designed as one blocking serial load.
- Run the relevant build or typecheck command when available, usually `npm run build` inside `frontend`.
