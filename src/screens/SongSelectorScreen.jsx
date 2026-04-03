// src/screens/SongSelectorScreen.jsx
import { motion } from 'framer-motion'
import { SONGS, COLOR_MAP } from '../data/songs.js'
import styles from './SongSelectorScreen.module.css'

export default function SongSelectorScreen({ onSelectSong, onBack, completedSongs }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pick a Song! 🎵</h2>

      <div className={styles.songGrid}>
        {SONGS.map((song, i) => {
          const firstNote = song.notes[0].note
          const color = COLOR_MAP[firstNote]
          const completed = completedSongs.includes(song.id)

          return (
            <motion.button
              key={song.id}
              className={styles.songCard}
              style={{ borderColor: color, background: `${color}18` }}
              onClick={() => onSelectSong(song)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 280 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className={styles.songEmoji}>{song.emoji}</span>
              <span className={styles.songName}>{song.name}</span>
              <span className={styles.difficulty}>
                {'⭐'.repeat(song.difficulty)}
              </span>
              {completed && <span className={styles.completedBadge}>✓ Done!</span>}
            </motion.button>
          )
        })}
      </div>

      <button className={styles.backBtn} onClick={onBack}>
        ← Back
      </button>
    </div>
  )
}
