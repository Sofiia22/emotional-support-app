# Plekai — Emotional Support App

Plekai is a private, multilingual wellbeing app built with Expo and React Native. The current MVP includes onboarding, local demo authentication, mood check-ins, an editable private journal, a guided breathing timer, an offline reading library, support resources, local reminders, and English/Ukrainian/Russian localization.

No AI service is connected. Profile, mood, journal, and activity data are stored locally on the device with AsyncStorage.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

Then open it in Expo Go, an emulator, or the web preview.

## Current product scope

- Splash and welcome experience
- Local-only sign-up/sign-in demo flow
- Three languages: English, Ukrainian, and Russian
- Mood check-in and local progress counters
- Daily mood history with one check-in per day
- Private local journal with edit, delete, and export
- Journal search across locally stored reflections
- Offline supportive reading library with favorites
- Guided one-minute 4–4–4 breathing exercise
- Grounding exercise and support resources
- Optional daily local reminders on iOS and Android
- Manual support-region selection with verified official crisis/emergency sources
- Local data export and wellbeing-data clearing controls
- In-app privacy notice and release safety documentation
- Automated tests for mood-history and reminder-time logic
- Responsive navigation for iOS, Android, and web

## Important safety note

Plekai is a wellbeing tool. It is not medical care, therapy, or an emergency service. Emergency-number availability depends on the user's region.

## Development commands

- `npm run web` — start the web app
- `npm run ios` — start the iOS app
- `npm run android` — start the Android app
- `npm run lint` — run lint checks
- `npx tsc --noEmit` — run TypeScript checks

The project uses file-based routing with Expo Router. Product code lives in `src/app`, `src/features`, `src/components`, and `src/shared`.
