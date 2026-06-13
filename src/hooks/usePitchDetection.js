// src/hooks/usePitchDetection.js
import { useState, useRef, useCallback } from 'react'
import { PitchDetector } from 'pitchy'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function freqToNoteName(frequency) {
  const A4 = 440
  const semitones = Math.round(12 * Math.log2(frequency / A4))
  const noteIndex = ((semitones % 12) + 12) % 12
  const octave = Math.floor((semitones + 57) / 12) + 1
  return `${NOTE_NAMES[noteIndex]}${octave}`
}

export function usePitchDetection() {
  const [detectedNote, setDetectedNote] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [micAllowed, setMicAllowed] = useState(false)

  const audioContextRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)
  const analyserRef = useRef(null)
  const detectorRef = useRef(null)
  const inputBufferRef = useRef(null)

  const stopListening = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setDetectedNote(null)
    setConfidence(0)
  }, [])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream
      setMicAllowed(true)

      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext
      // Resume is required — browsers suspend AudioContext until a user gesture
      await audioContext.resume()

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      analyserRef.current = analyser

      const bufferLength = analyser.fftSize
      const detector = PitchDetector.forFloat32Array(bufferLength)
      detectorRef.current = detector
      inputBufferRef.current = new Float32Array(bufferLength)

      const detect = () => {
        analyser.getFloatTimeDomainData(inputBufferRef.current)
        const [pitch, clarity] = detector.findPitch(inputBufferRef.current, audioContext.sampleRate)

        if (clarity > 0.9 && pitch > 50 && pitch < 2000) {
          const note = freqToNoteName(pitch)
          setDetectedNote(note)
          setConfidence(clarity)
        } else {
          setDetectedNote(null)
          setConfidence(clarity)
        }

        animFrameRef.current = requestAnimationFrame(detect)
      }

      detect()
    } catch (err) {
      console.error('Mic access denied:', err)
      setMicAllowed(false)
    }
  }, [])

  // Simple note: strip octave number
  const simpleNote = detectedNote ? detectedNote.replace(/[0-9]/g, '') : null

  return {
    detectedNote,
    simpleNote,
    confidence,
    micAllowed,
    startListening,
    stopListening,
  }
}
