import {midiToFrequency} from "./dsp.js"
import {Pattern} from "./pattern.js"

const FREQUENCIES = new Float32Array([
    96, 93, 91, 89, 86, 84, 81, 79,
    77, 74, 72, 69, 67, 65, 62, 60
].map(midiToFrequency))

registerProcessor("processor", class extends AudioWorkletProcessor {
    #pattern
    #stepIndex

    constructor(options) {
        super()

        this.#pattern = new Pattern(options.processorOptions.pattern)
        this.#stepIndex = new Uint8Array(options.processorOptions.stepIndex)
    }

    process(_inputs, [output]) {
        return true
    }
})