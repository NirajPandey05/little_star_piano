// src/components/MicStatus/MicStatus.jsx
import { motion } from 'framer-motion'
import styles from './MicStatus.module.css'

export default function MicStatus({ micAllowed }) {
  if (micAllowed === null || micAllowed === undefined) {
    return (
      <div className={`${styles.indicator} ${styles.idle}`}>
        🎤
      </div>
    )
  }

  if (micAllowed === false) {
    return (
      <div className={`${styles.indicator} ${styles.denied}`} title="Please allow microphone access in your browser">
        🎤 <span className={styles.deniedText}>Mic blocked — check browser settings</span>
      </div>
    )
  }

  return (
    <motion.div
      className={`${styles.indicator} ${styles.active}`}
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      🎤
    </motion.div>
  )
}
