// src/components/FindTheNote/FindTheNote.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PianoKeyboard from '../PianoKeyboard/PianoKeyboard.jsx'
import GuideCharacter from '../GuideCharacter/GuideCharacter.jsx'
import { usePitchDetection } from '../../hooks/usePitchDetection.js'
import { getFroggyResponse } from '../../services/aiService.js'
import { COLOR_MAP } from '../../data/songs.js'
import styles from './FindTheNote.module.css'
import * as Tone from 'tone'

// Curriculum order: start with easy-to-find notes
const CHALLENGE_SEQUENCE = ['C', 'G', 'E', 'D', 'A', 'F', 'B']

const sampler = new Tone.Sampler({
  urls: {
    C4: 'C4.mp3', D4: 'D4.mp3', E4: 'E4.mp3', F4: 'F4.mp3',
    G4: 'G4.mp3', A4: 'A4.mp3', B4: 'B4.mp3', C5: 'C5.mp3',
  },
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
}).toDestination()

function playNote(note) {
  Tone.start()
  sampler.triggerAttackRelease(`${note}4`, '2n')
}

function playCorrectSound() {
  Tone.start()
  const synth = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { release: 0.3 } }).toDestination()
  synth.triggerAttackRelease('C5', '8n')
  setTimeout(() => synth.triggerAttackRelease('E5', '8n'), 120)
  setTimeout(() => synth.triggerAttackRelease('G5', '4n'), 240)
  setTimeout(() => synth.dispose(), 1500)
}

export default function FindTheNote({ onChallengeComplete }) {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [starsEarned, setStarsEarned] = useState(0)
  const [totalChallenges] = useState(CHALLENGE_SEQUENCE.length)
  const [frogMessage, setFrogMessage] = useState('')
  const [frogEmotion, setFrogEmotion] = useState('happy')
  const [frogLoading, setFrogLoading] = useState(false)
  const [correctFlash, setCorrectFlash] = useState(false)

  const { simpleNote, micAllowed, startListening, stopListening } = usePitchDetection()
  const processingRef = useRef(false)
  const lastDetectedRef = useRef(null)
  const completeRef = useRef(false)

  const currentNote = CHALLENGE_SEQUENCE[challengeIndex]

  // Start the challenge with an AI greeting
  useEffect(() => {
    startListening()
    askForNote(currentNote)
    return () => stopListening()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function askForNote(note) {
    setFrogLoading(true)
    const res = await getFroggyResponse({ situation: 'hint', noteName: note })
    setFrogMessage(`Can you find the ${note}? Listen... 🎵`)
    setFrogEmotion('thinking')
    setFrogLoading(false)
    // Play the note after a short delay
    setTimeout(() => playNote(note), 600)
  }

  const handleCorrectNote = useCallback(async () => {
    if (processingRef.current || completeRef.current) return
    processingRef.current = true

    playCorrectSound()
    setCorrectFlash(true)
    setTimeout(() => setCorrectFlash(false), 600)

    const earned = wrongAttempts === 0 ? 3 : wrongAttempts <= 2 ? 2 : 1
    setStarsEarned(prev => prev + earned)

    const nextIndex = challengeIndex + 1

    if (nextIndex >= CHALLENGE_SEQUENCE.length) {
      completeRef.current = true
      setFrogLoading(true)
      const res = await getFroggyResponse({ situation: 'song_complete', songName: 'Find the Note' })
      setFrogMessage(res.message)
      setFrogEmotion(res.emotion)
      setFrogLoading(false)
      setTimeout(() => onChallengeComplete(starsEarned + earned), 2000)
    } else {
      setFrogLoading(true)
      const res = await getFroggyResponse({ situation: 'correct_note', noteName: currentNote })
      setFrogMessage(res.message)
      setFrogEmotion(res.emotion)
      setFrogLoading(false)

      setTimeout(() => {
        setChallengeIndex(nextIndex)
        setWrongAttempts(0)
        setShowHint(false)
        const nextNote = CHALLENGE_SEQUENCE[nextIndex]
        setTimeout(() => askForNote(nextNote), 500)
        processingRef.current = false
      }, 1500)
      return
    }

    setTimeout(() => { processingRef.current = false }, 800)
  }, [challengeIndex, wrongAttempts, currentNote, starsEarned, onChallengeComplete])

  const handleWrongNote = useCallback(async () => {
    if (processingRef.current || completeRef.current) return
    processingRef.current = true

    const newWrong = wrongAttempts + 1
    setWrongAttempts(newWrong)

    if (newWrong >= 3) {
      setShowHint(true)
    }

    if (newWrong % 2 === 0) {
      setFrogLoading(true)
      const res = await getFroggyResponse({
        situation: 'wrong_note',
        noteName: currentNote,
        wrongAttempts: newWrong,
      })
      setFrogMessage(`Ooh, not quite! Let me play it again... 🎵`)
      setFrogEmotion('encouraging')
      setFrogLoading(false)
      setTimeout(() => playNote(currentNote), 600)
    }

    setTimeout(() => { processingRef.current = false }, 700)
  }, [wrongAttempts, currentNote])

  useEffect(() => {
    if (!simpleNote || processingRef.current || completeRef.current) return
    if (simpleNote === lastDetectedRef.current) return
    lastDetectedRef.current = simpleNote

    if (simpleNote === currentNote) {
      handleCorrectNote()
    } else {
      handleWrongNote()
    }
  }, [simpleNote, currentNote, handleCorrectNote, handleWrongNote])

  return (
    <div className={styles.container}>
      <GuideCharacter
        message={frogMessage}
        emotion={frogEmotion}
        isLoading={frogLoading}
      />

      {/* Current challenge */}
      <motion.div
        className={styles.challengeCard}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className={styles.challengeLabel}>Find this note:</p>
        <motion.div
          className={styles.noteCircle}
          style={{ background: COLOR_MAP[currentNote] }}
          animate={correctFlash ? { scale: [1, 1.3, 1], transition: { duration: 0.4 } } : {}}
        >
          <span className={styles.noteLetter}>?</span>
        </motion.div>

        <button
          className={styles.playAgainBtn}
          onClick={() => { Tone.start(); playNote(currentNote) }}
        >
          🔊 Play the note again
        </button>
      </motion.div>

      {/* Progress */}
      <p className={styles.progressLabel}>
        Challenge {challengeIndex + 1} of {totalChallenges} • ⭐ {starsEarned} stars
      </p>

      {/* Piano keyboard — show hint after 3 wrong */}
      <PianoKeyboard
        targetNote={showHint ? currentNote : null}
        detectedNote={simpleNote}
        colorMap={COLOR_MAP}
        onKeyClick={(note) => {
          if (!processingRef.current) {
            lastDetectedRef.current = null
            if (note === currentNote) handleCorrectNote()
            else handleWrongNote()
          }
        }}
      />

      {!micAllowed && (
        <p className={styles.micWarning}>
          🎤 Please allow microphone access so the app can hear you play!
        </p>
      )}
    </div>
  )
}
