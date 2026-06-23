import {midiToFrequency} from "./dsp.js"
import {Pattern} from "./pattern.js"

const FREQUENCIES = new Float32Array([
    midiToFrequency(96), midiToFrequency(93), midiToFrequency(91), midiToFrequency(89),
    midiToFrequency(86), midiToFrequency(84), midiToFrequency(81), midiToFrequency(79),
    midiToFrequency(77), midiToFrequency(74), midiToFrequency(72), midiToFrequency(69),
    midiToFrequency(67), midiToFrequency(65), midiToFrequency(62), midiToFrequency(60)
])

registerProcessor("processor", class extends AudioWorkletProcessor {
    #pattern
    #stepIndex

    constructor({processorOptions: {pattern, stepIndex}}) {
        super()

        this.#pattern = new Pattern(pattern)
        this.#stepIndex = new Uint8Array(stepIndex)
    }

    process(_inputs, [output]) {
        return true
    }
})