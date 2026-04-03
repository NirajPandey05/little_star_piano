// src/components/SongFollower/SongFollower.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PianoKeyboard from '../PianoKeyboard/PianoKeyboard.jsx'
import GuideCharacter from '../GuideCharacter/GuideCharacter.jsx'
import { usePitchDetection } from '../../hooks/usePitchDetection.js'
import { getFroggyResponse } from '../../services/aiService.js'
import { COLOR_MAP } from '../../data/songs.js'
import styles from './SongFollower.module.css'
import * as Tone from 'tone'

const sampler = new Tone.Sampler({
  urls: {
    C4: 'C4.mp3', D4: 'D4.mp3', E4: 'E4.mp3', F4: 'F4.mp3',
    G4: 'G4.mp3', A4: 'A4.mp3', B4: 'B4.mp3', C5: 'C5.mp3',
  },
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
}).toDestination()

// Simple feedback sounds using Tone.js
function playCorrectSound() {
  const synth = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { release: 0.3 } }).toDestination()
  synth.triggerAttackRelease('C5', '8n')
  setTimeout(() => synth.triggerAttackRelease('E5', '8n'), 120)
  setTimeout(() => synth.triggerAttackRelease('G5', '4n'), 240)
  setTimeout(() => synth.dispose(), 1500)
}

function playWrongSound() {
  const synth = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { release: 0.4 } }).toDestination()
  synth.triggerAttackRelease('A3', '8n')
  setTimeout(() => synth.dispose(), 1000)
}

export default function SongFollower({ song, onSongComplete }) {
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [frogMessage, setFrogMessage] = useState("Let's play! Find the colored key! 🎵")
  const [frogEmotion, setFrogEmotion] = useState('happy')
  const [frogLoading, setFrogLoading] = useState(false)
  const [correctFlash, setCorrectFlash] = useState(false)
  const [wrongShake, setWrongShake] = useState(false)
  const [starsEarned, setStarsEarned] = useState(3)

  const { simpleNote, micAllowed, startListening, stopListening } = usePitchDetection()
  const lastDetectedRef = useRef(null)
  const processingRef = useRef(false)
  const songCompleteRef = useRef(false)

  const currentNote = song.notes[currentNoteIndex]

  useEffect(() => {
    startListening()
    return () => stopListening()
  }, [startListening, stopListening])

  const handleCorrectNote = useCallback(async () => {
    if (processingRef.current || songCompleteRef.current) return
    processingRef.current = true

    playCorrectSound()
    setCorrectFlash(true)
    setTimeout(() => setCorrectFlash(false), 600)

    const nextIndex = currentNoteIndex + 1

    if (nextIndex >= song.notes.length) {
      // Song complete
      songCompleteRef.current = true
      setFrogLoading(true)
      const res = await getFroggyResponse({ situation: 'song_complete', songName: song.name })
      setFrogMessage(res.message)
      setFrogEmotion(res.emotion)
      setFrogLoading(false)
      setTimeout(() => {
        onSongComplete(starsEarned)
      }, 2000)
    } else {
      setFrogLoading(true)
      setCurrentNoteIndex(nextIndex)
      setWrongAttempts(0)
      const res = await getFroggyResponse({
        situation: 'correct_note',
        noteName: currentNote.note,
        songName: song.name,
      })
      setFrogMessage(res.message)
      setFrogEmotion(res.emotion)
      setFrogLoading(false)
    }

    setTimeout(() => { processingRef.current = false }, 800)
  }, [currentNoteIndex, song, currentNote, starsEarned, onSongComplete])

  const handleWrongNote = useCallback(async (playedNote) => {
    if (processingRef.current || songCompleteRef.current) return
    processingRef.current = true

    const newWrong = wrongAttempts + 1
    setWrongAttempts(newWrong)
    setStarsEarned(prev => Math.max(1, prev - (newWrong > 3 ? 1 : 0)))

    // Only react every 2–3 wrong attempts to avoid being discouraging
    if (newWrong % 2 === 0) {
      playWrongSound()
      setWrongShake(true)
      setTimeout(() => setWrongShake(false), 500)

      const situation = newWrong >= 3 ? 'hint' : 'wrong_note'
      setFrogLoading(true)
      const res = await getFroggyResponse({
        situation,
        noteName: currentNote.note,
        wrongAttempts: newWrong,
        songName: song.name,
      })
      setFrogMessage(res.message)
      setFrogEmotion(res.emotion)
      setFrogLoading(false)
    }

    setTimeout(() => { processingRef.current = false }, 600)
  }, [wrongAttempts, currentNote, song])

  // React to detected notes
  useEffect(() => {
    if (!simpleNote || processingRef.current || songCompleteRef.current) return
    if (simpleNote === lastDetectedRef.current) return
    lastDetectedRef.current = simpleNote

    if (simpleNote === currentNote.note) {
      handleCorrectNote()
    } else {
      handleWrongNote(simpleNote)
    }
  }, [simpleNote, currentNote, handleCorrectNote, handleWrongNote])

  const progress = (currentNoteIndex / song.notes.length) * 100

  return (
    <div className={styles.container}>
      <GuideCharacter
        message={frogMessage}
        emotion={frogEmotion}
        isLoading={frogLoading}
      />

      {/* Current note indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNoteIndex}
          className={styles.noteIndicator}
          style={{ background: COLOR_MAP[currentNote.note] }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={
            wrongShake
              ? { x: [-8, 8, -6, 6, 0], transition: { duration: 0.4 } }
              : { scale: 1, opacity: 1, transition: { duration: 0.3 } }
          }
          exit={{ scale: 0.6, opacity: 0 }}
        >
          <span className={styles.noteLetter}>{currentNote.note}</span>
          {correctFlash && (
            <motion.div
              className={styles.correctOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <p className={styles.progressLabel}>
        {currentNoteIndex} / {song.notes.length} notes
      </p>

      {/* Piano keyboard */}
      <PianoKeyboard
        targetNote={currentNote.note}
        detectedNote={simpleNote}
        colorMap={COLOR_MAP}
        onKeyClick={(note) => {
          if (!processingRef.current && note === currentNote.note) {
            handleCorrectNote()
          } else if (!processingRef.current && note !== currentNote.note) {
            handleWrongNote(note)
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
