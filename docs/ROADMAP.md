# Plekai product roadmap

## Current milestone — local-first release candidate / approximately 85%

The current build delivers a complete local-first vertical slice:

- Expo SDK 56 application foundation for iOS, Android, and web
- splash, welcome, local registration, and local sign-in flows
- English, Ukrainian, and Russian localization across product screens
- persistent language, profile, mood, journal, and activity state
- mood check-in and local progress counters
- daily mood history with one editable check-in per calendar day
- private journal with create, edit, delete, and device-share export
- local journal search and result count
- offline three-language reading library with persistent favorites
- functional 4–4–4 breathing timer and grounding exercise
- support screen, emergency disclaimer, and confirmed phone handoff
- optional daily local notifications on iOS and Android
- reminder adjustment in 30-minute increments
- manually selected regional crisis and emergency resources linked to official sources
- privacy settings with JSON data export and local wellbeing-data clearing
- in-app privacy notice plus privacy and safety release documentation
- automated tests for mood-history and reminder-time rules
- reusable responsive header, profile overlay, and bottom navigation
- TypeScript, ESLint, and static web export checks

No AI, analytics, backend, or cloud account is connected at this milestone.

## Remaining release work — approximately 100%

- production authentication and encrypted cloud sync, if multi-device accounts are required
- exact native time picker and reminder deep links
- audio breathing guidance with downloadable/offline assets
- professionally reviewed reading content and moderation workflow
- region-aware crisis resources instead of a single emergency shortcut
- accessibility audit: screen reader, dynamic type, reduced motion, contrast
- component and end-to-end test suites in addition to the current logic tests
- final native icons, splash assets, privacy policy, and store metadata

## Release milestone — 100%

- production backend, recovery, account deletion, and data retention controls
- clinical/safety content review and escalation policy
- consent, privacy, security, and legal review for target launch regions
- crash reporting and privacy-preserving product analytics
- native device QA matrix and app-store release builds
- AI remains out of scope unless a separate safety, privacy, and cost phase is approved
