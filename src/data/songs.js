// src/data/songs.js

export const COLOR_MAP = {
  C: '#FF6B6B',   // coral red
  D: '#FF9F43',   // orange
  E: '#FFD93D',   // yellow
  F: '#6BCB77',   // green
  G: '#4DABF7',   // blue
  A: '#9775FA',   // purple
  B: '#F783AC',   // pink
}

export const SONGS = [
  {
    id: 'twinkle',
    name: 'Twinkle Twinkle ⭐',
    emoji: '⭐',
    difficulty: 1,
    notes: [
      { note: 'C', duration: 0.5 },
      { note: 'C', duration: 0.5 },
      { note: 'G', duration: 0.5 },
      { note: 'G', duration: 0.5 },
      { note: 'A', duration: 0.5 },
      { note: 'A', duration: 0.5 },
      { note: 'G', duration: 1.0 },
      { note: 'F', duration: 0.5 },
      { note: 'F', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 1.0 },
    ],
  },
  {
    id: 'mary',
    name: 'Mary Had a Little Lamb 🐑',
    emoji: '🐑',
    difficulty: 1,
    notes: [
      { note: 'E', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'E', duration: 1.0 },
      { note: 'D', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'D', duration: 1.0 },
      { note: 'E', duration: 0.5 },
      { note: 'G', duration: 0.5 },
      { note: 'G', duration: 1.0 },
    ],
  },
  {
    id: 'hot_cross',
    name: 'Hot Cross Buns 🥐',
    emoji: '🥐',
    difficulty: 1,
    notes: [
      { note: 'E', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 1.0 },
      { note: 'E', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 1.0 },
      { note: 'C', duration: 0.3 },
      { note: 'C', duration: 0.3 },
      { note: 'C', duration: 0.3 },
      { note: 'D', duration: 0.3 },
      { note: 'D', duration: 0.3 },
      { note: 'D', duration: 0.3 },
      { note: 'E', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 1.0 },
    ],
  },
  {
    id: 'ode_to_joy',
    name: 'Ode to Joy 🎵',
    emoji: '🎵',
    difficulty: 2,
    notes: [
      { note: 'E', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'F', duration: 0.5 },
      { note: 'G', duration: 0.5 },
      { note: 'G', duration: 0.5 },
      { note: 'F', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 0.5 },
      { note: 'C', duration: 0.5 },
      { note: 'D', duration: 0.5 },
      { note: 'E', duration: 0.5 },
      { note: 'E', duration: 0.75 },
      { note: 'D', duration: 0.25 },
      { note: 'D', duration: 1.0 },
    ],
  },
  {
    id: 'happy_birthday',
    name: 'Happy Birthday 🎂',
    emoji: '🎂',
    difficulty: 2,
    notes: [
      { note: 'C', duration: 0.3 },
      { note: 'C', duration: 0.3 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 0.5 },
      { note: 'F', duration: 0.5 },
      { note: 'E', duration: 1.0 },
      { note: 'C', duration: 0.3 },
      { note: 'C', duration: 0.3 },
      { note: 'D', duration: 0.5 },
      { note: 'C', duration: 0.5 },
      { note: 'G', duration: 0.5 },
      { note: 'F', duration: 1.0 },
    ],
  },
]
