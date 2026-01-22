'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';

export default function StickyScrollReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Total frames available
    const frameCount = 161;

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                // Format path: public/motion/frame_XXX.webp
                const frameNumber = i.toString().padStart(3, '0');
                img.src = `/motion/frame_${frameNumber}.webp`;
                await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(true); // Continue even if error
                });
                loadedImages.push(img);
            }

            setImages(loadedImages);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Map scroll progress to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        return frameIndex.on('change', (latest) => {
            setCurrentIndex(Math.round(latest));
        });
    }, [frameIndex]);

    // Text Opacity Transforms
    const text1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [0, 1, 0]);
    const text2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
    const text3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]);

    // Background Gradient Opacity (Darken as we scroll deep)
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.95, 1]);

    return (
        <section className="relative border-b border-border" id="demo-scroll-reveal">
            <div
                ref={containerRef}
                className="relative h-[600vh] w-full"
            >
                <div className="sticky top-20 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                    {/* Background Gradient */}
                    <motion.div
                        className="absolute "
                        style={{ opacity: bgOpacity }}
                    />

                    {/* Main Visual */}
                    <div className="relative z-10 w-full max-w-6xl aspect-video flex items-center justify-center p-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-muted-foreground animate-pulse">Loading Experience...</p>
                            </div>
                        ) : (
                            images[currentIndex] && (
                                <motion.img
                                    key={currentIndex}
                                    src={images[currentIndex].src}
                                    alt="Scroll Animation"
                                    className="w-full h-full object-contain drop-shadow-2xl rounded-xl bg-accent-foreground"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.1 }}
                                />
                            )
                        )}
                    </div>

                    {/* Overlays */}

                    <div className="absolute inset-0 z-20 pointer-events-none px-8">
                        {/* Text 1 */}
                        <motion.div
                            style={{ opacity: text1Opacity }}
                            className="absolute text-left"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-lg">
                                Detailed Analysis
                            </h2>
                            <p className="text-sm text-muted-foreground tracking-wide">
                                Every line of code, scrutinized.
                            </p>
                        </motion.div>

                        {/* Text 2 */}
                        <motion.div
                            style={{ opacity: text2Opacity }}
                            className="absolute text-left"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-lg">
                                AI Reviewing Result
                            </h2>
                            <p className="text-sm text-muted-foreground tracking-wide">
                                AI detects project code issues at a glance
                            </p>
                        </motion.div>

                        {/* Text 3 */}
                        <motion.div
                            style={{ opacity: text3Opacity }}
                            className="absolute text-left"
                        >
                            <h2 className="text-3xl  md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-lg">
                                Actionable Feedback
                            </h2>
                            <p className="text-sm text-muted-foreground tracking-wide">
                                Clear steps to improve code quality.
                            </p>
                        </motion.div>

                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-2"
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    >
                        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse"></div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Scroll to Explore</p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
