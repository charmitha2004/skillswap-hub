'use client'

type SplashScreenProps = {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B131F]">
      <video
        src="/skillvedio.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        className="w-auto max-w-full h-auto max-h-screen object-contain mix-blend-screen"
      />
    </div>
  )
}
