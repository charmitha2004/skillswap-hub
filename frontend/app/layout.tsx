import type { Metadata } from 'next'
import './globals.css'
import AuthGatedAICopilot from '../components/AuthGatedAICopilot'
import SplashIntro from '../components/SplashIntro'

export const metadata: Metadata = {
  title: 'SwapSkill Hub | Employee Skill Exchange',
  description: 'Learn anything by teaching what you know. Exchange skills with others in a community-driven platform.',
  keywords: 'skill swap, learning, teaching, exchange, skills, community',
  icons: {
    icon: '/swapskill-logo.png',
    shortcut: '/swapskill-logo.png',
    apple: '/swapskill-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <AuthGatedAICopilot />
        <SplashIntro />
      </body>
    </html>
  )
}
