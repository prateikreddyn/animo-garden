# Animo 

Build a web app called Animo ("life" in Latin) — a medication adherence app for senior citizens that replaces alarm-based pill reminders with a generative AI companion whose visual state reflects whether medication has been taken.

Core Concept

Most elderly patients know they need to take their pills, but alarms carry no emotional weight and are easy to dismiss, and there's no way to verify a dose was actually taken. Animo solves this by:

Having users scan each pill with their camera to confirm it's the correct medication before taking it.

Tying a visual AI companion (a small digital garden or creature) to adherence — it visibly thrives when doses are taken and gently signals absence when they're missed, the same instinct that makes people remember to water a plant or feed a pet.

Giving caregivers/family members visibility into adherence and a way to send encouragement back.

Critical Design Constraint (must inform every screen)

The companion's "missed dose" state must NEVER read as guilt, failure, punishment, or decay. Do not use wilting, dying, sad faces, darkening, or any visual language that could increase anxiety in users who may already fear memory loss or loss of independence. Missed-dose states should be neutral/gentle ("waiting for you," a soft dimming that brightens right back up) — never a downward spiral that requires "recovery." This is a hard constraint, not a style preference.

Also design with these physical realities in mind: users may have arthritis, tremor, low vision, or fatigue. Every core interaction (camera scan, voice check-in, button presses) needs large touch targets, high contrast, minimal precision required, and a non-camera fallback (e.g., verbal confirmation) for high-fatigue days.

Target Users

Primary: Seniors (60+) living alone, in retirement homes, or with family — need extreme simplicity, accessibility, and trust/privacy.

Secondary: Adult children / caregivers — need a simple dashboard to see adherence and send positive feedback (a photo, a short message) back to the senior.

Core User Flow

Home screen with large, clear buttons: Take Today's Medicine, Add a Pill, Visit Companion, Talk to AI Companion, Family Messages, Settings.

User selects a pill and scans it with the camera.

App cross-checks the photo against a stored "visual fingerprint" of that pill (registered when the pill was added) to confirm it matches.

On match: brief voice/text confirmation naming the pill ("This is your [pill name], your [time of day] dose"), then a simple tap or voice "yes, taking it now" to log it.

On mismatch: calm, non-alarming warning to double-check with a caregiver or pharmacist — never a scary or clinical-sounding error.

Companion updates visually to reflect the dose was taken; caregiver gets a notification.

Caregiver can send back a short encouraging message or photo, which appears as a small moment in the app.

Screens to Build

Welcome / onboarding (very simple, large text, minimal steps)

Login (simple, could be caregiver-assisted setup)

Home

Today's Medicines (list/schedule view)

Reminder screen

Pill Scanner (camera capture)

Verification result (match / no match)

Confirmation ("You've taken your [pill]" — warm, not clinical)

Companion / Garden view (the emotional core screen)

Rewards / streaks (framed as positive milestones, never loss-based)

Family Messages (caregiver notes/photos)

AI Companion chat (reminders, encouragement, small talk — explicitly NOT medical advice)

Add a Pill (register a new pill with photo + details)

Caregiver dashboard (adherence overview, send encouragement)

What the AI Companion Can and Cannot Do

Can: remind the user to take pills, give warm encouragement, act as a friendly presence/light companion, celebrate streaks. Cannot: give medical advice, act as a substitute doctor, or replace real human contact — the app should periodically nudge toward calling a real person, not just chatting with the AI.

Reward System

Points/positive feedback for: completing a scan, keeping a streak, receiving encouragement from a caregiver.

Weekly goals framed as invitations, not obligations ("keep your streak going" rather than "don't break your streak").

No punishing loss mechanics — streak resets should feel like a fresh start, not a failure state.

MVP Scope for This Build (per project's phased plan)

Build this as two testable layers first, not the full merged product:

Layer A — Pill match: camera capture → compare against a registered reference photo per pill → match/no-match result. Keep this simple (a basic image-similarity/classifier stub is fine); this is a prototype, not production pill-recognition.

Layer B — Companion state: a simple animated/illustrated companion (garden or creature) with 2–3 visual states (thriving, neutral/waiting, celebrating) driven by mock adherence data, plus a lightweight chat/encouragement UI.

Wire these two together into the full flow described above once both work independently. Use placeholder/mock data for pill registries and caregiver accounts — no real medical database integration needed for this prototype.

Tone & Visual Style

Warm, calm, high-contrast, large type, generous spacing, minimal jargon. This should feel like a gentle companion app for an older adult, not a clinical medical device and not a childish game. Avoid anything that reads as surveillance-heavy or infantilizing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://animo-garden.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cd4b6592-a925-4e66-a763-62e2ac5f145a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
