import {Pattern} from "./pattern.js"
import {View} from "./view.js"

(async () => {
    if (!self.crossOriginIsolated) {
        alert("SharedArrayBuffer disabled (cross-origin not isolated).")
        return
    }

    const canvas = document.querySelector("canvas#matrix")
    const pattern = new Pattern(new SharedArrayBuffer(Pattern.BYTE_LENGTH))
    const stepIndex = new Uint8Array(new SharedArrayBuffer(1))

    new View(pattern, stepIndex, canvas)

    const context = new AudioContext()
    await context.audioWorklet.addModule(new URL("./processor.js", import.meta.url))
    const node = new AudioWorkletNode(context, "processor", {
        outputChannelCount: [2],
        processorOptions: {pattern: pattern.buffer, stepIndex: stepIndex.buffer}
    })
    node.connect(context.destination)

    // Keep strong references so the graph is never garbage-collected.
    // Without this, some browsers collect the AudioContext once the IIFE's
    // closures are gone, silently stopping the worklet's process() loop.
    self.audio = {context, node}

    // print the current state of the AudioContext
    console.debug(`state: ${context.state}`)

    if (context.state !== "running") {
        console.debug("context suspended, click to resume.")
        window.addEventListener("click", async (event) => {
            console.debug("resuming context...")
            await context.resume().then(
                () => console.debug(`state: ${context.state}`),
                () => console.warn("cannot resume."))
            event.preventDefault()
        }, {passive: false, once: true})
    }

    // prevent mobile quirks
    document.addEventListener("touchmove", (event) => event.preventDefault(), {passive: false})
    document.addEventListener("dblclick", (event) => event.preventDefault(), {passive: false})
    const resize = () => document.body.style.height = `${window.innerHeight}px`
    window.addEventListener("resize", resize)
    resize()
    console.debug("boot complete.")
})()