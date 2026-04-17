# Design System Specification: Editorial Case Management

## 1. Overview & Creative North Star
**The Creative North Star: "The Disciplined Curator"**

In the high-velocity world of Customer Service and Air Traffic Control (ATC) case management, cognitive load is the enemy. This design system rejects the "dashboard-as-a-cockpit" cliché of cluttered widgets and harsh grid lines. Instead, it adopts an **Editorial Precision** approach. 

We treat case data like high-end journalism: prioritize the narrative, maximize breathing room, and use intentional asymmetry to guide the eye. By breaking the "template" look through overlapping surfaces and a rigorous "No-Line" philosophy, we transform a functional tool into an elegant, calm, and authoritative workspace.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

This palette is rooted in soft slate and atmospheric blues. We do not use lines to define space; we use light.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are prohibited for sectioning. Boundaries must be defined solely through background color shifts. Use `surface-container-low` (#f0f4f7) sections sitting on a `surface` (#f7f9fb) background to create distinction.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of fine, semi-transparent paper.
- **Layer 0 (Base):** `surface` (#f7f9fb) – The canvas.
- **Layer 1 (Main Content):** `surface-container-low` (#f0f4f7) – Content wrappers.
- **Layer 2 (Interactive Elements):** `surface-container-lowest` (#ffffff) – Used for cards or inputs to create a "lifted" feel.
- **Layer 3 (Overlays):** `surface-bright` (#f7f9fb) with Glassmorphism.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" look:
- **Floating Navigation/Modals:** Apply a backdrop-blur (12px–20px) to `surface-container-lowest` at 85% opacity.
- **Signature Textures:** For high-priority Case CTAs, use a subtle linear gradient from `primary` (#565e74) to `primary-container` (#dae2fd) at a 45-degree angle. This adds "soul" to the functional slate tones.

---

## 3. Typography: The Hierarchy of Clarity

We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** A modern sans-serif with geometric foundations. Used for high-level data points (e.g., Case IDs, Status Headers).
    *   `display-lg` (3.5rem): Reserved for empty state hero text or large KPIs.
    *   `headline-sm` (1.5rem): Standard header for case titles.
*   **Body & Labels (Inter):** A workhorse typeface designed for screen legibility.
    *   `body-md` (0.875rem): The standard for case notes and logs.
    *   `label-sm` (0.6875rem): Used for metadata (timestamps, agent IDs) in all-caps with 0.05em tracking to imply authority.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too heavy for a minimalist system. We use **Ambient Light** principles.

### The Layering Principle
Depth is achieved by "stacking" tiers. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#f0f4f7) section provides a soft, natural lift without a single pixel of shadow.

### Ambient Shadows
Where floating is required (e.g., Popovers):
- **Value:** `0px 12px 32px rgba(42, 52, 57, 0.06)`
- **Note:** The shadow color is a tinted version of `on-surface` (#2a3439), not pure black.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., high-contrast mode), use `outline-variant` (#a9b4b9) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (Primary to Primary-Container), `on-primary` text. Roundedness: `md` (0.375rem).
- **Secondary:** `surface-container-highest` (#d9e4ea) background. No border.
- **Tertiary:** Ghost style. Text-only using `tertiary` (#00668b).

### Cards & Case Lists
- **Rule:** Forbid divider lines. Use `8px` of vertical white space between list items.
- **State Indication:** Instead of a colored border, use a 4px vertical "pill" on the far left of the card using `error` (#9f403d) or `tertiary` (#00668b) to denote priority.

### Case Status Chips
- **Success:** `tertiary-container` (#2db7f2) background with `on-tertiary-container` (#003044) text.
- **Warning/Error:** `error-container` (#fe8983) background with `on-error-container` (#752121) text.
- **Shape:** Use `full` (9999px) roundedness for a friendly, modern feel.

### Input Fields
- **Default State:** `surface-container-lowest` (#ffffff) background with a "Ghost Border."
- **Focus State:** Background remains white, but the "Ghost Border" opacity increases to 40% with a 2px `surface-tint` (#565e74) glow.

### ATC Timeline View (Custom Component)
A vertical thread representing the case history. Use `surface-variant` (#d9e4ea) for the thread line, but set the opacity to 30%. Events are `surface-container-lowest` cards that "overlap" the line to create a sense of three-dimensional history.

---

## 6. Do's and Don'ts

### Do
- **Do** use `surface-container-lowest` for all interactive surface areas to make them "pop" against the background.
- **Do** use wide margins (at least 32px) between major functional groups to reduce agent anxiety.
- **Do** use `manrope` for numbers. Its geometric clarity makes Case IDs and timers easier to scan.

### Don't
- **Don't** use pure black (#000000) for text. Use `on-surface` (#2a3439) to maintain the soft, professional slate aesthetic.
- **Don't** use standard "Select" dropdowns. Use custom-styled Glassmorphism menus that appear to float over the interface.
- **Don't** use icons without labels for primary actions. In ATC environments, "Clear over Clever" is the rule.

---

## 7. Roundedness Scale
*   **Component Default:** `md` (0.375rem) — For buttons and inputs.
*   **Large Containers:** `xl` (0.75rem) — For main dashboard cards.
*   **Status/Pills:** `full` (9999px) — For status chips and tags.