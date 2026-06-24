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

    console.debug(`state: ${context.state}`)

    if (context.state !== "running") {
        window.addEventListener("click", (event) => {
            context.resume().then(console.debug, console.warn)
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
