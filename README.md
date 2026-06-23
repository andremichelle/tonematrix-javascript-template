# ToneMatrix — Audio Programming Template

A starter template for building a **ToneMatrix** step sequencer in the browser with
plain JavaScript and the Web Audio API. Created for a course at
[Hochschule für Musik und Tanz Köln (HfMT Köln)](https://www.hfmt-koeln.de).

The visuals, the UI and the supporting infrastructure are provided for you. **Your task
is to write the audio processor** — the part that reads the pattern and synthesises sound.

## What you will learn

By implementing the processor you will learn how real-time audio works in the browser:
running DSP code on the `AudioWorklet` thread, keeping a steady playhead across audio
blocks, synthesising tones from a step pattern, and sharing state between the UI and
audio threads with `SharedArrayBuffer`.

## The idea

A 16×16 grid. Each column is a step in time, each row is a pitch. Toggle cells on the
canvas and the sequencer plays them back as a looping melody. A fluid "ripple" effect
visualises the playing steps.

## How it is wired together

```
main.js (main thread)                 processor.js (audio thread)
  ├─ Pattern  ──┐                        ┌──► reads pattern  (which cells are on)
  │             ├─ SharedArrayBuffer ────┤
  ├─ stepIndex ─┘                        └──► writes stepIndex (current column)
  │
  └─ View ──── draws the grid + reads stepIndex for the ripple effect
```

- **`main.js`** — boots the app: creates the shared buffers, the `View`, the
  `AudioContext` and the `AudioWorkletNode`, then connects everything.
- **`pattern.js`** — `Pattern`, a 16×16 bitfield of toggled steps, backed by a
  `SharedArrayBuffer` so the UI and the audio thread see the same data.
- **`view.js`** — canvas rendering, pointer/touch input and the fluid ripple animation.
- **`dsp.js`** — small DSP helpers: MIDI→frequency, bars↔frames↔seconds conversions,
  an attack/release envelope and a `fragment` generator for sub-block step timing.
- **`processor.js`** — the `AudioWorkletProcessor`. **This is the file you implement.**
  The skeleton receives the shared buffers in its constructor and is responsible for:
  1. stepping through the pattern in time,
  2. writing the current column into `stepIndex`,
  3. producing audio for every active step.

### Shared state between threads

Because the audio runs on a separate thread (the `AudioWorklet`), the pattern and the
playhead position are exchanged through `SharedArrayBuffer`s — no message passing per
frame. This requires the page to be **cross-origin isolated** (see the server below).

## Getting the code in Phoenix Code

[Phoenix Code](https://phcode.dev) can clone the repo for you: **File → Git → Clone**,
paste the URL below, and pick a folder. The Git panel then handles commits and pushes
from inside the editor.

```
https://github.com/andremichelle/tonematrix-javascript-template.git
```

> ⚠️ Do **not** use Phoenix Code's built-in Live Preview to run the app — it does not set
> the cross-origin isolation headers `SharedArrayBuffer` needs. Use the server below.

## Dev tooling

There is **no build step**. `npm` is only used for ESLint:

```bash
npm install
npm run lint
```

## Running locally

The included server sets the COOP/COEP headers that enable `SharedArrayBuffer`:

```bash
node serve.mjs
```

Then open **http://localhost:8080** in your browser (not the IDE's live-preview — it does
not set the required isolation headers).

## Controls

- **Click / drag** on the grid to toggle steps.
- **Space** clears the pattern.
