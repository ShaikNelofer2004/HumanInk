import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import './index.css'
import App from './App.jsx'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#8e2de2', // Matches text-ink-primary
          colorBackground: '#0a0a0c', // Matches site bg
          colorInputBackground: '#1a1a1c',
          colorText: 'white',
          fontFamily: '"Outfit", sans-serif'
        },
        elements: {
          card: "border border-white/10 shadow-2xl backdrop-blur-xl",
          headerTitle: "font-outfit font-bold",
          headerSubtitle: "font-inter",
          socialButtonsBlockButton: "border border-white/10 hover:bg-white/5",
          formButtonPrimary: "font-outfit font-semibold tracking-wide uppercase hover:scale-[1.02] transition-transform",
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
