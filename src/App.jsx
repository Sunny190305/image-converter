import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Converter from './components/Converter';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Footer from './components/Footer';
import CursorEffects from './components/CursorEffects';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <CursorEffects />
      <Navbar />
      <main>
        <Hero />
        <Converter />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;
