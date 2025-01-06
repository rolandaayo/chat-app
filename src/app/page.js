import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatInterface from './components/ChatInterface'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <ChatInterface />
      </main>
      <Footer />
    </div>
  )
}
