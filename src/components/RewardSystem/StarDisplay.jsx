// src/components/RewardSystem/StarDisplay.jsx
import { motion } from 'framer-motion'
import styles from './RewardSystem.module.css'

export default function StarDisplay({ stars, maxStars = 3 }) {
  return (
    <div className={styles.starRow}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          className={styles.star}
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={
            i < stars
              ? { scale: 1, rotate: 0, opacity: 1 }
              : { scale: 0.5, rotate: 0, opacity: 0.25 }
          }
          transition={{ delay: i * 0.3, type: 'spring', stiffness: 300, damping: 15 }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  )
}
