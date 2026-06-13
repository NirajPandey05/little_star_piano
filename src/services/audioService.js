// src/services/audioService.js
// Shared singleton audio — prevents duplicate Tone.Sampler instances and
// ensures Tone.start() is called (required before any user-gesture AudioContext use).
import * as Tone from 'tone'

let samplerInstance = null

function getSampler() {
  if (!samplerInstance) {
    samplerInstance = new Tone.Sampler({
      urls: {
        C4: 'C4.mp3', D4: 'D4.mp3', E4: 'E4.mp3', F4: 'F4.mp3',
        G4: 'G4.mp3', A4: 'A4.mp3', B4: 'B4.mp3', C5: 'C5.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).toDestination()
  }
  return samplerInstance
}

export function playNoteAudio(note) {
  Tone.start()
  getSampler().triggerAttackRelease(`${note}4`, '2n')
}

export function playCorrectSound() {
  Tone.start()
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { release: 0.3 },
  }).toDestination()
  synth.triggerAttackRelease('C5', '8n')
  setTimeout(() => synth.triggerAttackRelease('E5', '8n'), 120)
  setTimeout(() => synth.triggerAttackRelease('G5', '4n'), 240)
  setTimeout(() => synth.dispose(), 1500)
}

export function playWrongSound() {
  Tone.start()
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { release: 0.4 },
  }).toDestination()
  synth.triggerAttackRelease('A3', '8n')
  setTimeout(() => synth.dispose(), 1000)
}
