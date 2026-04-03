// src/components/PianoKeyboard/PianoKeyboard.jsx
import { motion, AnimatePresence } from 'framer-motion'
import styles from './PianoKeyboard.module.css'

// 37 keys: C3 to C6
// We'll build the key layout for 3 octaves + C6
const OCTAVES = [3, 4, 5]
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_NOTES_IN_OCTAVE = [
  { note: 'C#', afterWhiteIndex: 0 },
  { note: 'D#', afterWhiteIndex: 1 },
  // no black after E (index 2)
  { note: 'F#', afterWhiteIndex: 3 },
  { note: 'G#', afterWhiteIndex: 4 },
  { note: 'A#', afterWhiteIndex: 5 },
  // no black after B (index 6)
]

// Build key list
function buildKeys() {
  const whiteKeys = []
  const blackKeys = []

  OCTAVES.forEach(octave => {
    WHITE_NOTES.forEach((note, i) => {
      whiteKeys.push({ note, octave, id: `${note}${octave}` })
    })
    // Black keys for this octave
    const startWhiteIndex = OCTAVES.indexOf(octave) * 7
    BLACK_NOTES_IN_OCTAVE.forEach(({ note, afterWhiteIndex }) => {
      blackKeys.push({
        note,
        octave,
        id: `${note}${octave}`,
        afterWhiteIndex: startWhiteIndex + afterWhiteIndex,
      })
    })
  })
  // Add C6
  whiteKeys.push({ note: 'C', octave: 6, id: 'C6' })

  return { whiteKeys, blackKeys }
}

const { whiteKeys, blackKeys } = buildKeys()

export default function PianoKeyboard({ targetNote, detectedNote, colorMap, onKeyClick }) {
  const WHITE_KEY_WIDTH = 40
  const WHITE_KEY_HEIGHT = 160
  const BLACK_KEY_WIDTH = 26
  const BLACK_KEY_HEIGHT = 100

  function getWhiteKeyStyle(key) {
    const noteLetter = key.note
    const isTarget = targetNote && noteLetter === targetNote
    const isDetected = detectedNote && noteLetter === detectedNote
    const isCorrect = isTarget && isDetected

    let bg = '#fff'
    let boxShadow = 'inset 0 -4px 0 rgba(0,0,0,0.15)'
    let border = '1px solid #ccc'

    if (isCorrect) {
      bg = '#6BCB77'
      boxShadow = '0 0 20px 8px rgba(107,203,119,0.7)'
    } else if (isTarget && colorMap && colorMap[noteLetter]) {
      bg = colorMap[noteLetter]
      boxShadow = `0 0 16px 6px ${colorMap[noteLetter]}99`
    } else if (isDetected) {
      bg = '#bee3f8'
      boxShadow = '0 0 12px 4px #4DABF7aa'
    }

    return { background: bg, boxShadow, border }
  }

  function getBlackKeyStyle(key) {
    const noteLetter = key.note
    const isTarget = targetNote && noteLetter === targetNote
    const isDetected = detectedNote && noteLetter === detectedNote
    const isCorrect = isTarget && isDetected

    let bg = '#222'
    let boxShadow = 'inset 0 -2px 0 rgba(255,255,255,0.2)'

    if (isCorrect) {
      bg = '#38A169'
      boxShadow = '0 0 14px 6px rgba(56,161,105,0.8)'
    } else if (isTarget && colorMap && colorMap[noteLetter]) {
      bg = colorMap[noteLetter]
      boxShadow = `0 0 12px 4px ${colorMap[noteLetter]}99`
    } else if (isDetected) {
      bg = '#4DABF7'
      boxShadow = '0 0 10px 4px #4DABF7aa'
    }

    return { background: bg, boxShadow }
  }

  const totalWidth = whiteKeys.length * WHITE_KEY_WIDTH

  return (
    <div className={styles.keyboardWrapper}>
      <div
        className={styles.keyboard}
        style={{ width: totalWidth, height: WHITE_KEY_HEIGHT, position: 'relative' }}
      >
        {/* White keys */}
        {whiteKeys.map((key, idx) => {
          const noteLetter = key.note
          const isTarget = targetNote && noteLetter === targetNote
          const isDetected = detectedNote && noteLetter === detectedNote
          const keyStyle = getWhiteKeyStyle(key)

          return (
            <motion.div
              key={key.id}
              className={`${styles.whiteKey} ${isTarget ? styles.targetKey : ''} ${isDetected ? styles.detectedKey : ''}`}
              style={{
                left: idx * WHITE_KEY_WIDTH,
                width: WHITE_KEY_WIDTH,
                height: WHITE_KEY_HEIGHT,
                ...keyStyle,
              }}
              animate={
                isDetected
                  ? { scaleY: [1, 0.96, 1], transition: { duration: 0.2 } }
                  : isTarget
                  ? { scale: [1, 1.01, 1], transition: { duration: 0.8, repeat: Infinity } }
                  : {}
              }
              onClick={() => onKeyClick && onKeyClick(noteLetter)}
              whileTap={{ scaleY: 0.95 }}
            >
              <span className={styles.keyLabel}>{noteLetter}</span>
            </motion.div>
          )
        })}

        {/* Black keys */}
        {blackKeys.map(key => {
          const noteLetter = key.note
          const isTarget = targetNote && noteLetter === targetNote
          const isDetected = detectedNote && noteLetter === detectedNote
          const keyStyle = getBlackKeyStyle(key)

          // Position: black key sits between two white keys
          // afterWhiteIndex is the 0-based index of the white key to the LEFT
          const leftPos = (key.afterWhiteIndex + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2

          return (
            <motion.div
              key={key.id}
              className={`${styles.blackKey} ${isTarget ? styles.targetKey : ''} ${isDetected ? styles.detectedKey : ''}`}
              style={{
                left: leftPos,
                width: BLACK_KEY_WIDTH,
                height: BLACK_KEY_HEIGHT,
                ...keyStyle,
              }}
              animate={
                isDetected
                  ? { scaleY: [1, 0.93, 1], transition: { duration: 0.2 } }
                  : isTarget
                  ? { scale: [1, 1.02, 1], transition: { duration: 0.8, repeat: Infinity } }
                  : {}
              }
              onClick={() => onKeyClick && onKeyClick(noteLetter)}
              whileTap={{ scaleY: 0.92 }}
            />
          )
        })}
      </div>
    </div>
  )
}
