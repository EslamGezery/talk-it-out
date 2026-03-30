
# Talk it Out — Native Mobile App

## Overview
A Capacitor-based mobile app where users watch a rewarded ad, then talk to Gemini AI with a 5-minute timer. Speech is converted to text, sent to Gemini, and the response is spoken back via native TTS.

## Screens & Components

### Home Screen
- **Header**: "Talk it Out" app name prominently displayed
- **Timer**: Digital countdown display showing 05:00, counts down when active
- **Talk Button**: Large, centered, beautifully animated button with pulse/ripple animation when active (listening state)
- **Status indicator**: Shows current state — "Watch ad to start", "Listening...", "Thinking...", "Speaking..."

### Settings Panel (accessible via gear icon)
- **Google Gemini API Key** input field — stored in localStorage
- **AdMob Ad Unit ID** input field — placeholder pre-filled
- Save button with validation

## Core Flow
1. User opens app → sees Talk button (disabled until ad watched)
2. Tap Talk → triggers rewarded video ad
3. After ad completes → Talk button activates, timer starts at 05:00
4. App listens via Web Speech API (SpeechRecognition), shows listening animation
5. On speech end → sends transcript to Gemini API (`/v1beta/models/gemini-2.0-flash:generateContent`)
6. Receives Gemini response → speaks it via native TTS (Capacitor Text-to-Speech plugin)
7. User can keep talking until timer hits 00:00
8. At 00:00 or manual stop → show another rewarded ad before allowing restart

## Technical Setup
- **Capacitor plugins**: `@capacitor-community/admob` for rewarded ads, `@capacitor/text-to-speech` for TTS
- **Speech-to-Text**: Web Speech API (works in Capacitor WebView on Android; for iOS, will note limitations)
- **Gemini API**: Direct REST calls using the user-provided API key from settings
- **Animations**: Tailwind + CSS keyframes for pulse, ripple, and breathing effects on the Talk button
- **State management**: React useState/useRef for timer, recording state, conversation flow

## Design
- Dark theme with vibrant accent color for the Talk button
- Smooth gradient background
- Large, tactile button with glowing animation when active
- Clean typography for timer display (monospace/digital font feel)
