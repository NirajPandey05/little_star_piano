// src/screens/WelcomeScreen.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GuideCharacter from '../components/GuideCharacter/GuideCharacter.jsx'
import { getFroggyResponse } from '../services/aiService.js'
import styles from './WelcomeScreen.module.css'

export default function WelcomeScreen({ onStart }) {
  const [message, setMessage] = useState("Hi! I'm Froggy! Let's play piano together! 🐸")
  const [emotion, setEmotion] = useState('happy')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function greet() {
      setLoading(true)
      const res = await getFroggyResponse({ situation: 'greeting' })
      setMessage(res.message)
      setEmotion(res.emotion)
      setLoading(false)
    }
    greet()
  }, [])

  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        🎹 Little Piano Star
      </motion.h1>

      <GuideCharacter message={message} emotion={emotion} isLoading={loading} />

      <motion.button
        className={styles.startBtn}
        onClick={onStart}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's Play! 🎉
      </motion.button>
    </div>
  )
}
