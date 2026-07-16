# TODO

- [ ] Implement the navigation simplification in `src/components/SiteHeader.tsx`.

  - [ ] Remove navigation items: Platform, Pricing, Customers, Resources
  - [ ] Remove ALL dropdown/mega menu logic (PlatformMenu, Platform trigger, DesktopNav/mobile accordion, timers/hover handlers/state)
  - [ ] Keep only: Logo (left), Sign In link, Book a Demo button
  - [ ] Ensure responsive rules: Desktop/tablet show Logo | Sign In | Book a Demo; Mobile show Logo and Book a Demo (hide Sign In if needed)
  - [ ] Remove unused imports/components after deletions
  - [ ] Ensure no TypeScript/ESLint/build errors for the updated header
