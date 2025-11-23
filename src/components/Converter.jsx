import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Check, Download, Loader2, ChevronDown } from 'lucide-react';

const Converter = () => {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState('JPG');
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, converting, success
    const [downloadUrl, setDownloadUrl] = useState(null);
    const fileInputRef = useRef(null);

    const formats = ['JPG', 'PNG', 'WEBP', 'GIF', 'PDF'];

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setDownloadUrl(null);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setDownloadUrl(null);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setStatus('converting');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/convert`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Conversion failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            setDownloadUrl(url);
            setStatus('success');

        } catch (error) {
            console.error('Full conversion error:', error);
            setStatus('idle');
            alert(`Conversion failed: ${error.message}. Check console for details.`);
        }
    };

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setDownloadUrl(null);
    };

    return (
        <section id="converter" className="py-20 relative z-20 -mt-20">
            <div className="container max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-panel p-8 md:p-12 relative overflow-hidden"
                    style={{
                        background: isDragging ? 'rgba(102, 126, 234, 0.08)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    {/* Gradient glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1" style={{
                        background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
                        opacity: 0.6
                    }}></div>

                    {!file ? (
                        <div
                            className="border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300"
                            style={{
                                borderColor: isDragging ? '#667eea' : 'rgba(255, 255, 255, 0.15)',
                                background: isDragging ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                boxShadow: isDragging ? '0 0 30px rgba(102, 126, 234, 0.3)' : 'none',
                                transform: isDragging ? 'scale(1.02)' : 'scale(1)'
                            }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <motion.div
                                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{
                                    background: isDragging ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.05)',
                                    boxShadow: isDragging ? '0 0 20px rgba(102, 126, 234, 0.4)' : 'inset 0 2px 8px rgba(0,0,0,0.3)'
                                }}
                                animate={{ scale: isDragging ? 1.1 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'}`} />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: isDragging ? '#667eea' : '#ffffff' }}>
                                Drag & Drop your image here
                            </h3>
                            <p className="mb-8" style={{ color: '#b4b4c8' }}>or click to browse from your computer</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-4 rounded-full font-semibold transition-all duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                }}
                            >
                                Browse File
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* File Info */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-between p-4 rounded-xl border"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                                        color: '#667eea'
                                    }}>
                                        <File className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                                        <p className="text-sm" style={{ color: '#b4b4c8' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={reset}
                                    className="p-2 rounded-full transition-all duration-200"
                                    style={{ background: 'transparent' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <X className="w-5 h-5" style={{ color: '#b4b4c8' }} />
                                </button>
                            </motion.div>

                            {/* Controls */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1" style={{ color: '#b4b4c8' }}>Convert to</label>
                                    <div className="relative">
                                        <select
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="w-full rounded-xl px-4 py-3 appearance-none focus:outline-none transition-colors cursor-pointer"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.4)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: '#ffffff'
                                            }}
                                            disabled={status !== 'idle'}
                                        >
                                            {formats.map((f) => (
                                                <option key={f} value={f}>
                                                    {f}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#b4b4c8', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    {status === 'idle' && (
                                        <button
                                            onClick={handleConvert}
                                            className="w-full rounded-full h-[50px] flex items-center justify-center gap-2 font-semibold transition-all duration-300"
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                            }}
                                        >
                                            Convert Image
                                        </button>
                                    )}
                                    {status === 'converting' && (
                                        <button disabled className="w-full rounded-full h-[50px] flex items-center justify-center gap-2 cursor-not-allowed" style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: '#b4b4c8',
                                            border: 'none',
                                            opacity: 0.7
                                        }}>
                                            <Loader2 className="w-5 h-5" style={{ animation: 'spin 1s linear infinite' }} />
                                            Converting...
                                        </button>
                                    )}
                                    {status === 'success' && (
                                        <a
                                            href={downloadUrl}
                                            download={`converted.${format.toLowerCase()}`}
                                            className="w-full rounded-full h-[50px] flex items-center justify-center gap-2 font-semibold transition-all duration-300 no-underline"
                                            style={{
                                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                color: 'white',
                                                boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(67, 233, 123, 0.6)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(67, 233, 123, 0.4)';
                                            }}
                                        >
                                            <Download className="w-5 h-5" />
                                            Download {format}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Success Message */}
                            <AnimatePresence>
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="rounded-xl p-4 flex items-center gap-3"
                                        style={{
                                            background: 'rgba(67, 233, 123, 0.1)',
                                            border: '1px solid rgba(67, 233, 123, 0.2)',
                                            color: '#43e97b'
                                        }}
                                    >
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                                            background: '#43e97b',
                                            color: '#0a0a0f'
                                        }}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <p className="font-medium">Conversion complete! Your file is ready for download.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Converter;
