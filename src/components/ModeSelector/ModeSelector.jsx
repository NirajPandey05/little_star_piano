// src/components/ModeSelector/ModeSelector.jsx
import { motion } from 'framer-motion'
import styles from './ModeSelector.module.css'

export default function ModeSelector({ onSelectMode, onOpenStickers, totalStars }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>What do you want to do? 🎹</h2>

      <div className={styles.modeCards}>
        <motion.button
          className={`${styles.modeCard} ${styles.followMe}`}
          onClick={() => onSelectMode('follow')}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className={styles.modeEmoji}>🌈</span>
          <span className={styles.modeName}>Follow Me</span>
          <span className={styles.modeDesc}>Follow the colored keys and play along!</span>
        </motion.button>

        <motion.button
          className={`${styles.modeCard} ${styles.findNote}`}
          onClick={() => onSelectMode('find')}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={styles.modeEmoji}>👂</span>
          <span className={styles.modeName}>Find the Note</span>
          <span className={styles.modeDesc}>Listen and find the secret note by ear!</span>
        </motion.button>
      </div>

      <motion.button
        className={styles.stickersBtn}
        onClick={onOpenStickers}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        ⭐ My Stickers &nbsp;·&nbsp; {totalStars} stars
      </motion.button>
    </div>
  )
}
