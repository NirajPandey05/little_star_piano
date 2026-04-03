// src/screens/SongCompleteScreen.jsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import StarDisplay from '../components/RewardSystem/StarDisplay.jsx'
import styles from './SongCompleteScreen.module.css'

export default function SongCompleteScreen({ stars, songName, newStickers, onPlayAgain, onChooseAnother }) {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.celebration}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 16 }}
      >
        🎉
      </motion.div>

      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Amazing job!
      </motion.h2>

      <motion.p
        className={styles.songName}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        You played {songName}! 🎵
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <StarDisplay stars={stars} maxStars={3} />
      </motion.div>

      {newStickers && newStickers.length > 0 && (
        <motion.div
          className={styles.newStickers}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 260 }}
        >
          <p className={styles.stickerLabel}>New sticker unlocked! 🎊</p>
          <div className={styles.stickerRow}>
            {newStickers.map(s => (
              <span key={s} className={styles.newSticker}>{s}</span>
            ))}
          </div>
        </motion.div>
      )}

      <div className={styles.btnRow}>
        <motion.button
          className={styles.playAgainBtn}
          onClick={onPlayAgain}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Play Again
        </motion.button>

        <motion.button
          className={styles.chooseBtn}
          onClick={onChooseAnother}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎵 Choose Another Song
        </motion.button>
      </div>
    </div>
  )
}
