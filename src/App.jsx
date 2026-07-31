import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Volume2, VolumeX, Sparkles, X, Music, MailOpen, Mail } from 'lucide-react'
import './App.css'

// Helper to generate floating particles/hearts
const generateHearts = (count = 15) => {
  return Array.from({ length: count }).map((_, idx) => ({
    id: idx,
    x: Math.random() * 100, // percentage from left
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 15,
    scale: 0.5 + Math.random() * 1.2,
    rotate: Math.random() * 360,
  }))
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sparkles, setSparkles] = useState([])
  const [hearts, setHearts] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef(null)

  // Initialize hearts and screen size check
  useEffect(() => {
    setHearts(generateHearts(20))
    const checkMobile = () => setIsMobile(window.innerWidth < 600)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Audio control
  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Audio autoplay prevented. Click interaction handled.", err)
      })
      setIsPlaying(true)
    }
  }

  // Auto-play music when envelope is opened
  const handleOpenEnvelope = () => {
    setIsOpen(true)
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((e) => console.log("Audio play deferred", e))
      setIsPlaying(true)
    }
    // Generate celebratory sparkles
    const newSparkles = Array.from({ length: 15 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: 30 + Math.random() * 40,
      y: 40 + Math.random() * 30,
      scale: 0.5 + Math.random() * 1.5,
    }))
    setSparkles(newSparkles)
  }

  // Animation variants
  const envelopeVariants = {
    closed: {
      rotateY: 0,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    open: {
      scale: 0.95,
      y: isMobile ? 150 : 250, // Slides down to give space for the letter
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const flapVariants = {
    closed: {
      rotateX: 0,
      zIndex: 3,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
    open: {
      rotateX: 180,
      zIndex: 1,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  }

  const letterVariants = {
    closed: {
      y: 0,
      height: isMobile ? 270 : 340,
      scale: 0.9,
      zIndex: 2,
      opacity: 0,
      pointerEvents: "none",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    open: {
      y: isMobile ? -90 : -150, // Balanced upward translation relative to envelope
      height: isMobile ? 460 : 580,
      scale: 1.05,
      zIndex: 5,
      opacity: 1,
      pointerEvents: "auto",
      transition: { delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const textContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8
      }
    }
  }

  const textLineVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 12 } }
  }

  return (
    <main className="love-letter-page-bg">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/@coldplay  - Sparks (Lyrics).mp3"
        loop
      />

      {/* Floating Background Hearts */}
      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="floating-heart"
            style={{ left: `${h.x}%` }}
            initial={{ y: "110vh", scale: h.scale, rotate: h.rotate, opacity: 0 }}
            animate={{
              y: "-15vh",
              opacity: [0, 0.6, 0.6, 0],
              rotate: h.rotate + 360,
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              delay: h.delay,
              ease: "linear",
            }}
          >
            <Heart fill="currentColor" size={24} />
          </motion.div>
        ))}
      </div>

      {/* Audio Controls & UI Overlay */}
      <div className="top-actions">
        <button
          type="button"
          onClick={toggleMusic}
          className={`audio-toggle-btn ${isPlaying ? 'is-playing' : ''}`}
          aria-label="Toggle background music"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>{isPlaying ? 'Mute Music' : 'Play Music'}</span>
        </button>
      </div>

      {/* Main Experience Container */}
      <div className="experience-viewport">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="intro-speech-bubble"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={16} className="inline-sparkle" />
              <span>Ada surat manis untukmu. Klik segel lilin untuk membuka!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="envelope-perspective-wrapper">
          {/* Outer Envelope Wrapper */}
          <motion.div
            className={`envelope-wrapper ${isOpen ? 'is-active' : ''}`}
            variants={envelopeVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
          >
            {/* ENVELOPE BACK (inside structure) */}
            <div className="envelope-back">
              {/* Triangular inner shade */}
              <div className="envelope-inner-fold"></div>
            </div>

            {/* THE ACTUAL LETTER PAPER */}
            <motion.div
              className="letter-paper"
              variants={letterVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
            >
              {/* Paper Decorative Borders */}
              <div className="letter-inner-border">
                {/* Close Button Inside Letter */}
                <button
                  type="button"
                  className="letter-close-icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Letter"
                >
                  <X size={18} />
                </button>

                {/* Letter Header */}
                <div className="letter-header">
                  <div className="metadata-row">
                    <span className="meta-tag">UNTUK: <span className="meta-text">Nama❤️</span></span>
                    <span className="meta-tag">DARI: <span className="meta-text">Arif (eji)</span></span>
                  </div>
                  <div className="love-stamp-badge">
                    <Heart className="mini-heart-icon" fill="currentColor" size={14} />
                    <span>01.08.2026</span>
                  </div>
                </div>

                <div className="letter-divider" />

                {/* Romantic Message (Typewriter/Staggered Reveal) */}
                <motion.div
                  className="letter-body"
                  variants={textContainerVariants}
                  initial="hidden"
                  animate={isOpen ? "show" : "hidden"}
                >
                  <motion.h2 className="letter-salutation" variants={textLineVariants}>
                    Dear NAMA,
                  </motion.h2>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    August 1st. Everyone’s busy celebrating with the usual flowers, sweet messages, and all those cliché little things. But you know me—I’ve never really been the type to follow clichés. So, if I’m going to say something to you, I’d rather mean every word of it.
                  </motion.p>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    Having you in my life was never just about being able to call you my girlfriend. It’s about the way you somehow get through the parts of me that I usually keep buried—the darker, messier sides of me that even I don’t always know how to control. Somehow, you still manage to stay.
                  </motion.p>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    You’re the exception to almost every rule I’ve ever made for myself. I might be stubborn. I might be selfish sometimes. I might expect more from you than I probably should. But if there’s one thing I’ll never be uncertain about, it’s this: I want you here.
                  </motion.p>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    So don’t get too comfortable thinking you can just walk away whenever things get difficult. You’re already a part of my world, and I’m not going to pretend I wouldn’t notice if you suddenly disappeared from it.
                  </motion.p>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    I’ll annoy you, argue with you, tease you, and probably be way too stubborn for my own good. But I’ll also be here—choosing you, reminding you where you belong, and making sure you never have to question whether you matter to me. And whenever that little voice in your head tells you that you’re somehow not enough for me, I’ll be there to prove it wrong. Every single time.
                  </motion.p>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    You don’t have to compete with some imaginary version of “better.” I chose you. I’m still choosing you. And I don’t need you to become someone else just to deserve the place you already have beside me.
                  </motion.p>

                  {/* Interactive Polaroid Photo inside the Letter */}
                  <motion.div
                    className="polaroid-wrapper"
                    variants={textLineVariants}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    drag={!isMobile}
                    dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
                    title={isMobile ? undefined : "Geser fotonya!"}
                  >
                    <div className="polaroid-frame">
                      <div className="polaroid-image-container">
                        <img src="/lovu.jpg" alt="Sabrina & Arif" className="polaroid-image" />
                      </div>
                      <div className="polaroid-caption">
                        <span>Nama & Arif </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p className="letter-paragraph love-ending" variants={textLineVariants}>
                    Happy Girlfriend Day, sweetheart.
                  </motion.p>

                  <motion.p className="letter-paragraph" variants={textLineVariants}>
                    And just so we’re clear—don’t mistake my patience for permission to leave whenever you feel like it. You’re already a part of my life, and I’m not the kind of person who lets go that easily.
                  </motion.p>

                  <motion.div className="letter-signature" variants={textLineVariants}>
                    <span>Your boyfriend,</span>
                    <span className="signature-name">eji</span>
                  </motion.div>
                </motion.div>

                {/* Footer seal watermark */}
                <div className="letter-watermark">
                  <svg viewBox="0 0 100 100" width="80" height="80">
                    <path
                      id="watermarkPath"
                      d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      fill="none"
                    />
                    <text fontFamily="monospace" fontSize="8" fill="rgba(143, 35, 48, 0.15)" letterSpacing="1">
                      <textPath href="#watermarkPath">MADE FOR NAMA • FOREVER &amp; ALWAYS • </textPath>
                    </text>
                    <path
                      d="M 45 47 C 45 43, 55 43, 55 47 C 55 52, 50 54, 50 57 C 50 54, 45 52, 45 47 Z"
                      fill="rgba(143, 35, 48, 0.12)"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* ENVELOPE TOP FLAP */}
            <motion.div
              className="envelope-flap"
              variants={flapVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              style={{ transformOrigin: "top center" }}
            >
              {/* Outer color */}
              <div className="envelope-flap-outer" />
            </motion.div>

            {/* ENVELOPE FRONT COVER / POCKET */}
            <div className="envelope-front">
              <div className="envelope-left-fold" />
              <div className="envelope-right-fold" />
              <div className="envelope-bottom-fold" />
            </div>

            {/* WAX SEAL (Centered on flap point) */}
            <AnimatePresence>
              {!isOpen && (
                <motion.button
                  type="button"
                  className="wax-seal-btn"
                  onClick={handleOpenEnvelope}
                  exit={{
                    scale: 0.1,
                    opacity: 0,
                    rotate: 45,
                    transition: { duration: 0.5, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Klik untuk membuka surat cinta"
                >
                  <div className="wax-seal-circle">
                    <Heart className="wax-seal-heart" fill="currentColor" />
                  </div>
                  <span className="seal-tooltip">Buka ❤️</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Celebrating Sparkles on Open */}
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            className="sparkle-particle"
            style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: sp.scale,
              opacity: 0,
              y: -80,
              x: (Math.random() - 0.5) * 60,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Sparkles size={16} fill="rgba(255, 214, 222, 0.9)" className="sparkle-icon" />
          </motion.div>
        ))}
      </div>
    </main>
  )
}
