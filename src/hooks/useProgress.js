// src/hooks/useProgress.js
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'littlePianoStar_progress'

const defaultProgress = {
  totalStars: 0,
  unlockedStickers: [],
  songsCompleted: [],
  streak: 0,
  lastPlayed: null,
}

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : { ...defaultProgress }
  } catch {
    return { ...defaultProgress }
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // ignore storage errors
  }
}

// Sticker unlocks at these star thresholds
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

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const addStars = useCallback((count) => {
    setProgress(prev => {
      const newTotal = prev.totalStars + count
      const today = new Date().toDateString()
      const wasToday = prev.lastPlayed === today
      const newStreak = wasToday ? prev.streak : prev.streak + 1

      // Check new sticker unlocks
      const newStickers = STICKER_UNLOCKS
        .filter(s => s.stars <= newTotal && !prev.unlockedStickers.includes(s.emoji))
        .map(s => s.emoji)

      const updated = {
        ...prev,
        totalStars: newTotal,
        streak: newStreak,
        lastPlayed: today,
        unlockedStickers: [...prev.unlockedStickers, ...newStickers],
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const unlockSticker = useCallback((emoji) => {
    setProgress(prev => {
      if (prev.unlockedStickers.includes(emoji)) return prev
      const updated = { ...prev, unlockedStickers: [...prev.unlockedStickers, emoji] }
      saveProgress(updated)
      return updated
    })
  }, [])

  const markSongComplete = useCallback((songId) => {
    setProgress(prev => {
      if (prev.songsCompleted.includes(songId)) return prev
      const updated = { ...prev, songsCompleted: [...prev.songsCompleted, songId] }
      saveProgress(updated)
      return updated
    })
  }, [])

  return { progress, addStars, unlockSticker, markSongComplete }
}
