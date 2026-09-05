'use client'

import { useCallback, useRef } from 'react'

/**
 * Tiny Web Audio chime — no asset files. The pitch is passed in per mood so
 * completing a task "sounds" like the current vibe. Only ever triggered by a
 * user gesture, so it never autoplays.
 */
export function useChime() {
  const ctxRef = useRef<AudioContext | null>(null)

  return useCallback((frequency: number, enabled: boolean) => {
    if (!enabled || typeof window === 'undefined') return

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return

    if (!ctxRef.current) ctxRef.current = new AudioCtx()
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') void ctx.resume()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(frequency, now)
    // a gentle upward blip
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.12)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.36)
  }, [])
}
