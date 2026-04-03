// src/components/RewardSystem/StickerBook.jsx
import { motion } from 'framer-motion'
import styles from './RewardSystem.module.css'

const ALL_STICKERS = ['🌟', '🎵', '🐸', '🎀', '🦋', '🌈', '🎉', '🏆', '🎠', '🎡']

export default function StickerBook({ unlockedStickers, onBack }) {
  return (
    <div className={styles.stickerBookContainer}>
      <h2 className={styles.stickerTitle}>My Sticker Book! ⭐</h2>
      <div className={styles.stickerGrid}>
        {ALL_STICKERS.map((emoji, i) => {
          const unlocked = unlockedStickers.includes(emoji)
          return (
            <motion.div
              key={emoji}
              className={`${styles.stickerSlot} ${unlocked ? styles.unlocked : styles.locked}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 280 }}
              whileHover={unlocked ? { scale: 1.15, rotate: 5 } : {}}
            >
              {unlocked ? (
                <span className={styles.stickerEmoji}>{emoji}</span>
              ) : (
                <span className={styles.lockedIcon}>🔒</span>
              )}
            </motion.div>
          )
        })}
      </div>
      <p className={styles.stickerHint}>
        Keep playing to unlock more stickers! 🌟
      </p>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back
      </button>
    </div>
  )
}
