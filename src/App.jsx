// src/App.jsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import WelcomeScreen from './screens/WelcomeScreen.jsx'
import SongSelectorScreen from './screens/SongSelectorScreen.jsx'
import SongCompleteScreen from './screens/SongCompleteScreen.jsx'
import ModeSelector from './components/ModeSelector/ModeSelector.jsx'
import SongFollower from './components/SongFollower/SongFollower.jsx'
import FindTheNote from './components/FindTheNote/FindTheNote.jsx'
import StickerBook from './components/RewardSystem/StickerBook.jsx'
import MicStatus from './components/MicStatus/MicStatus.jsx'
import { useProgress } from './hooks/useProgress.js'
import styles from './App.module.css'

const STICKER_UNLOCKS = [
  { stars: 1,  emoji: '🌟' },
  { stars: 3,  emoji: '🎵' },
  { stars: 6,  emoji: '🐸' },
  { stars: 10, emoji: '🎀' },
  { stars: 15, emoji: '🦋' },
  { stars: 21, emoji: '🌈' },
  { stars: 28, emoji: '🎉' },
  { stars: 36, emoji: '🏆' },
  { stars: 45, emoji: '🎠' },
  { stars: 55, emoji: '🎡' },
]

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [selectedSong, setSelectedSong] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)
  const [lastStars, setLastStars] = useState(0)
  const [newlyUnlocked, setNewlyUnlocked] = useState([])
  const [micAllowed, setMicAllowed] = useState(null)

  const { progress, addStars, markSongComplete } = useProgress()

  function handleSongComplete(stars) {
    const prevTotal = progress.totalStars
    addStars(stars)
    markSongComplete(selectedSong.id)
    setLastStars(stars)

    // Detect newly unlocked stickers
    const newTotal = prevTotal + stars
    const justUnlocked = STICKER_UNLOCKS
      .filter(s => s.stars <= newTotal && s.stars > prevTotal)
      .map(s => s.emoji)
    setNewlyUnlocked(justUnlocked)
    setScreen('songComplete')
  }

  function handleChallengeComplete(stars) {
    addStars(stars)
    setLastStars(stars)
    setNewlyUnlocked([])
    setScreen('songComplete')
  }

  function navigateTo(s) {
    setScreen(s)
  }

  const screenVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
  }

  function renderScreen() {
    switch (screen) {
      case 'welcome':
        return (
          <motion.div key="welcome" {...screenVariants}>
            <WelcomeScreen onStart={() => navigateTo('modeSelector')} />
          </motion.div>
        )

      case 'modeSelector':
        return (
          <motion.div key="modeSelector" {...screenVariants}>
            <ModeSelector
              onSelectMode={(mode) => {
                setSelectedMode(mode)
                if (mode === 'follow') navigateTo('songSelector')
                else navigateTo('findTheNote')
              }}
              onOpenStickers={() => navigateTo('stickerBook')}
              totalStars={progress.totalStars}
            />
          </motion.div>
        )

      case 'songSelector':
        return (
          <motion.div key="songSelector" {...screenVariants}>
            <SongSelectorScreen
              onSelectSong={(song) => {
                setSelectedSong(song)
                navigateTo('songFollower')
              }}
              onBack={() => navigateTo('modeSelector')}
              completedSongs={progress.songsCompleted}
            />
          </motion.div>
        )

      case 'songFollower':
        return (
          <motion.div key="songFollower" {...screenVariants}>
            <div className={styles.screenHeader}>
              <button className={styles.backBtn} onClick={() => navigateTo('songSelector')}>
                ← Back
              </button>
              <span className={styles.songTitle}>{selectedSong?.name}</span>
              <MicStatus micAllowed={micAllowed} />
            </div>
            <SongFollower
              song={selectedSong}
              onSongComplete={handleSongComplete}
            />
          </motion.div>
        )

      case 'findTheNote':
        return (
          <motion.div key="findTheNote" {...screenVariants}>
            <div className={styles.screenHeader}>
              <button className={styles.backBtn} onClick={() => navigateTo('modeSelector')}>
                ← Back
              </button>
              <span className={styles.songTitle}>Find the Note 👂</span>
              <MicStatus micAllowed={micAllowed} />
            </div>
            <FindTheNote onChallengeComplete={handleChallengeComplete} />
          </motion.div>
        )

      case 'songComplete':
        return (
          <motion.div key="songComplete" {...screenVariants}>
            <SongCompleteScreen
              stars={lastStars}
              songName={selectedMode === 'find' ? 'Find the Note' : selectedSong?.name}
              newStickers={newlyUnlocked}
              onPlayAgain={() => {
                if (selectedMode === 'find') navigateTo('findTheNote')
                else navigateTo('songFollower')
              }}
              onChooseAnother={() => {
                if (selectedMode === 'find') navigateTo('modeSelector')
                else navigateTo('songSelector')
              }}
            />
          </motion.div>
        )

      case 'stickerBook':
        return (
          <motion.div key="stickerBook" {...screenVariants}>
            <StickerBook
              unlockedStickers={progress.unlockedStickers}
              onBack={() => navigateTo('modeSelector')}
            />
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.app}>
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  )
}
