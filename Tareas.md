---
name: Academic Core
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e2'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fc'
  surface-container: '#ededf6'
  surface-container-high: '#e7e7f1'
  surface-container-highest: '#e1e2eb'
  on-surface: '#191b22'
  on-surface-variant: '#434653'
  inverse-surface: '#2e3037'
  inverse-on-surface: '#f0f0f9'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#1d59c1'
  primary: '#003c90'
  on-primary: '#ffffff'
  primary-container: '#0f52ba'
  on-primary-container: '#bcceff'
  inverse-primary: '#b0c6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#3d4143'
  on-tertiary: '#ffffff'
  tertiary-container: '#55585a'
  on-tertiary-container: '#ccced0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00419c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#faf8ff'
  on-background: '#191b22'
  surface-variant: '#e1e2eb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-max: 1440px
  sidebar-width: 260px
---

## Brand & Style
The design system is built on the pillars of transparency, efficiency, and institutional trust. It bridges the gap between high-utility administrative software and user-centric educational tools. The style is **Corporate Modern**, prioritizing clarity and speed of information retrieval for students and administrators.

The visual language uses a structured hierarchy with ample whitespace to reduce cognitive load during data-heavy tasks. It employs a "Soft Professional" aesthetic—utilizing geometric precision tempered by intentional roundedness to appear approachable yet authoritative. The emotional response should be one of calm control and reliability.

## Colors
The palette is anchored by a deep **Institutional Blue** that signals stability. This is supported by a functional range of neutrals and semantic status colors.

- **Primary**: Used for key actions, active navigation states, and primary branding.
- **Secondary**: A cool slate gray for secondary actions and iconography.
- **Surface**: Backgrounds use a tiered system of clean whites and ultra-light grays (#F8FAFC) to separate content zones.
- **Status Colors**: High-saturation hues for immediate recognition of report statuses:
    - **Success (Green)**: Approved / Completed.
    - **Warning (Yellow)**: Pending / Action Required.
    - **Error (Red)**: Rejected / Overdue.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-dense environments. 

- **Hierarchy**: Use `display-lg` exclusively for dashboard overviews. `headline-md` and `title-md` serve as the primary structural markers for page sections and card titles.
- **Data Tables**: Body copy for tables should use `body-md` to maximize information density without sacrificing readability.
- **Labels**: `label-md` is reserved for table headers and status badges to provide clear visual distinction from data.

## Layout & Spacing
The system follows an **8px grid** for vertical rhythm and a **12-column fluid grid** for content.

- **Sidebar**: A fixed left-hand navigation (260px) provides consistent orientation. On mobile, this transitions to a bottom navigation bar or a hidden drawer.
- **Page Margins**: Standard desktop margins are 32px (`lg`), scaling down to 16px (`sm`) on mobile.
- **Gaps**: Use 24px (`md`) for the main gutter between cards and 16px (`sm`) for spacing within card elements.
- **Density**: Administrators have a "Compact Mode" option that reduces internal padding by 50% for high-volume data review.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Ambient Shadows**.

1.  **Level 0 (Background)**: The base canvas is `#F8FAFC`.
2.  **Level 1 (Cards/Sidebar)**: Pure white (#FFFFFF) with a soft, 1px neutral border (#E2E8F0).
3.  **Level 2 (Hover/Active States)**: A very diffused shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
4.  **Level 3 (Modals)**: High elevation with a darker backdrop blur to isolate administrative tasks.

Avoid heavy black shadows; use blue-tinted grays for shadow colors to maintain the professional palette.

## Shapes
The design system uses a **Rounded (8px)** corner strategy to soften the corporate aesthetic and feel modern.

- **Standard Elements**: Buttons, Input fields, and Cards use the base 8px (`rounded-md`).
- **Large Components**: Dashboards containers and main modals use 16px (`rounded-lg`).
- **Badges**: Status badges use a fully pill-shaped radius to distinguish them as non-interactive status indicators.
- **Selection Markers**: Active sidebar states use a 4px rounded vertical bar on the leading edge.

## Components

- **Buttons**: Primary buttons are solid Blue. Secondary buttons use an outline style with a 1px border. All buttons include a subtle hover transition that darkens the background by 10%.
- **Status Badges**: Small, pill-shaped markers with a light background tint and high-contrast text of the same hue (e.g., Green text on light green background).
- **Cards**: The primary container for reports. Cards must include a `title-md` header, a subtle 1px divider, and a padded body area.
- **Data Tables**: Zebra-striping is omitted in favor of thin horizontal lines. Headers are sticky and use the `label-md` typography.
- **Input Fields**: Labeled clearly above the field. Focus states use a 2px Primary Blue glow.
- **Sidebar**: Dark-themed (`neutral_gray`) or Light-themed; active links are highlighted with the Primary Blue and a subtle background tint.
- **Search Bars**: Located prominently in the header, utilizing a magnifying glass icon and a soft grey background for quick accessibility.