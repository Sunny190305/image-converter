import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Layers, MousePointer } from 'lucide-react';

const features = [
    {
        icon: <Zap className="w-6 h-6" />,
        title: 'Lightning Fast',
        desc: 'Advanced algorithms ensure your images are converted in milliseconds.',
    },
    {
        icon: <Layers className="w-6 h-6" />,
        title: 'Multiple Formats',
        desc: 'Support for all major image formats including WEBP, GIF, and PDF.',
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'Secure & Private',
        desc: 'Files are processed locally or deleted immediately after conversion.',
    },
    {
        icon: <MousePointer className="w-6 h-6" />,
        title: 'No Sign-up',
        desc: 'Start converting immediately without creating an account.',
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Why Choose ImageX</h2>
                    <p className="section-subtitle">Built for speed, quality, and privacy</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-400">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
