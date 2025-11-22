import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Settings, Zap, Download } from 'lucide-react';

const steps = [
    {
        icon: <UploadCloud className="w-8 h-8" />,
        title: 'Upload Image',
        desc: 'Drag & drop or select a file from your device.',
    },
    {
        icon: <Settings className="w-8 h-8" />,
        title: 'Choose Format',
        desc: 'Select your desired output format (JPG, PNG, etc).',
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Convert',
        desc: 'Our powerful engine converts your file in seconds.',
    },
    {
        icon: <Download className="w-8 h-8" />,
        title: 'Download',
        desc: 'Save your new high-quality image instantly.',
    },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 bg-black/20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Simple steps to convert your images</p>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            <div className="glass-panel p-8 h-full hover:bg-white/10 transition-all duration-300 border-transparent hover:border-white/10">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/5">
                                    <div className="text-blue-400 group-hover:text-white transition-colors">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 select-none">
                                    0{index + 1}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
