// src/components/FindTheNote/FindTheNote.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PianoKeyboard from '../PianoKeyboard/PianoKeyboard.jsx'
import GuideCharacter from '../GuideCharacter/GuideCharacter.jsx'
import { usePitchDetection } from '../../hooks/usePitchDetection.js'
import { getFroggyResponse } from '../../services/aiService.js'
import { playNoteAudio, playCorrectSound } from '../../services/audioService.js'
import { COLOR_MAP } from '../../data/songs.js'
import styles from './FindTheNote.module.css'

// Curriculum order: start with easy-to-find notes
const CHALLENGE_SEQUENCE = ['C', 'G', 'E', 'D', 'A', 'F', 'B']

export default function FindTheNote({ onChallengeComplete, onMicStatusChange }) {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [frogMessage, setFrogMessage] = useState('')
  const [frogEmotion, setFrogEmotion] = useState('happy')
  const [frogLoading, setFrogLoading] = useState(false)
  const [correctFlash, setCorrectFlash] = useState(false)

  // Accumulate stars in a ref so handleCorrectNote always sees the running total,
  // not a stale closure snapshot from React state.
  const starsEarnedRef = useRef(0)

  const { simpleNote, micAllowed, startListening, stopListening } = usePitchDetection()
  const processingRef = useRef(false)
  const lastDetectedRef = useRef(null)
  const completeRef = useRef(false)

  const currentNote = CHALLENGE_SEQUENCE[challengeIndex]

  useEffect(() => {
    startListening()
    askForNote(CHALLENGE_SEQUENCE[0])
    return () => stopListening()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Propagate mic status to parent for the header indicator
  useEffect(() => {
    if (onMicStatusChange) onMicStatusChange(micAllowed)
  }, [micAllowed, onMicStatusChange])

  // Reset the "last detected" gate whenever the challenge note changes,
  // so the child can play the same note in back-to-back challenges.
  useEffect(() => {
    lastDetectedRef.current = null
  }, [challengeIndex])

  async function askForNote(note) {
    setFrogMessage(`Can you find the ${note}? Listen... 🎵`)
    setFrogEmotion('thinking')
    setTimeout(() => playNoteAudio(note), 600)
  }

  const handleCorrectNote = useCallback(async () => {
    if (processingRef.current || completeRef.current) return
    processingRef.current = true

    try {
      playCorrectSound()
      setCorrectFlash(true)
      setTimeout(() => setCorrectFlash(false), 600)

      const wrongNow = wrongAttempts
      const earned = wrongNow === 0 ? 3 : wrongNow <= 2 ? 2 : 1
      starsEarnedRef.current += earned

      const nextIndex = challengeIndex + 1

      if (nextIndex >= CHALLENGE_SEQUENCE.length) {
        completeRef.current = true
        setFrogLoading(true)
        const res = await getFroggyResponse({ situation: 'song_complete', songName: 'Find the Note' })
        setFrogMessage(res.message)
        setFrogEmotion(res.emotion)
        setFrogLoading(false)
        setTimeout(() => onChallengeComplete(starsEarnedRef.current), 2000)
      } else {
        setFrogLoading(true)
        const res = await getFroggyResponse({ situation: 'correct_note', noteName: currentNote })
        setFrogMessage(res.message)
        setFrogEmotion(res.emotion)
        setFrogLoading(false)

        setChallengeIndex(nextIndex)
        setWrongAttempts(0)
        setShowHint(false)
        setTimeout(() => askForNote(CHALLENGE_SEQUENCE[nextIndex]), 500)
      }
    } finally {
      if (!completeRef.current) processingRef.current = false
    }
  }, [challengeIndex, wrongAttempts, currentNote, onChallengeComplete])

  const handleWrongNote = useCallback(async () => {
    if (processingRef.current || completeRef.current) return
    processingRef.current = true

    try {
      const newWrong = wrongAttempts + 1
      setWrongAttempts(newWrong)

      if (newWrong >= 3) setShowHint(true)

      if (newWrong % 2 === 0) {
        setFrogMessage(`Ooh, not quite! Let me play it again... 🎵`)
        setFrogEmotion('encouraging')
        setTimeout(() => playNoteAudio(currentNote), 600)
      }
    } finally {
      processingRef.current = false
    }
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

      <motion.div
        className={styles.challengeCard}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className={styles.challengeLabel}>Find this note:</p>
        <motion.div
          className={styles.noteCircle}
          style={{ background: COLOR_MAP[currentNote] }}
          animate={correctFlash ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className={styles.noteLetter}>?</span>
        </motion.div>

        <button
          className={styles.playAgainBtn}
          onClick={() => playNoteAudio(currentNote)}
        >
          🔊 Play the note again
        </button>
      </motion.div>

      <p className={styles.progressLabel}>
        Challenge {challengeIndex + 1} of {CHALLENGE_SEQUENCE.length} • ⭐ {starsEarnedRef.current} stars
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

      {micAllowed === false && (
        <p className={styles.micWarning}>
          🎤 Please allow microphone access so the app can hear you play!
        </p>
      )}
    </div>
  )
}
