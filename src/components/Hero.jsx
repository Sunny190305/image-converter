import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileImage } from 'lucide-react';

const Hero = () => {
    const scrollToConverter = () => {
        document.getElementById('converter').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" data-parallax="0.5"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" data-parallax="0.3"></div>
            </div>

            <div className="container text-center z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm text-gray-300">Fast, Secure & Free</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                        Convert Your Images <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Instantly & Securely
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Upload any image and convert it to JPG, PNG, WEBP, GIF or PDF in seconds.
                        No sign-up required, completely free.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={scrollToConverter}
                            className="neon-button flex items-center gap-2 text-lg group"
                        >
                            Start Converting
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-lg font-medium flex items-center gap-2">
                            <FileImage className="w-5 h-5" />
                            View Formats
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
