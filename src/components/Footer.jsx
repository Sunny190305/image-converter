import React from 'react';
import { Github, Instagram, Linkedin, Image } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="footer" className="bg-black border-t border-white/10 py-12">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Image className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            ImageX <span className="text-blue-500">Convert</span>
                        </span>
                    </div>

                    <div className="text-gray-500 text-sm">
                        © 2025 ImageX Convert. All rights reserved.
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
