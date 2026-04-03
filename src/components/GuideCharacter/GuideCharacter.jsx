// src/components/GuideCharacter/GuideCharacter.jsx
import { motion, AnimatePresence } from 'framer-motion'
import styles from './GuideCharacter.module.css'

const emotionVariants = {
  happy: {
    animate: {
      y: [0, -12, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  },
  thinking: {
    animate: {
      rotate: [-5, 5, -5, 5, 0],
      transition: { duration: 1.2, ease: 'easeInOut' },
    },
  },
  celebrating: {
    animate: {
      rotate: [0, -15, 15, -10, 10, 0],
      scale: [1, 1.3, 1.1, 1.25, 1],
      y: [0, -20, 0, -15, 0],
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  },
  encouraging: {
    animate: {
      scale: [1, 1.08, 1, 1.05, 1],
      transition: { duration: 1.0, ease: 'easeInOut' },
    },
  },
}

const idleAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
}

export default function GuideCharacter({ message, emotion = 'happy', isLoading = false }) {
  const variant = emotionVariants[emotion] || emotionVariants.happy

  return (
    <div className={styles.characterContainer}>
      <motion.div
        className={styles.froggy}
        key={emotion}
        animate={variant.animate}
      >
        <motion.span
          className={styles.frogEmoji}
          animate={idleAnimation}
        >
          🐸
        </motion.span>
      </motion.div>

      <div className={styles.speechBubble}>
        <div className={styles.bubbleTail} />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className={styles.loadingDots}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>.</span><span>.</span><span>.</span>
            </motion.div>
          ) : (
            <motion.p
              key={message}
              className={styles.message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
