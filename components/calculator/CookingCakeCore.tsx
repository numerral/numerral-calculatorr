"use client";

import React, { useState, useMemo } from "react";

type PanShape = "round" | "square" | "rectangle";

export default function CookingCakeCore() {
    const [originalShape, setOriginalShape] = useState<PanShape>("round");
    const [originalDim1, setOriginalDim1] = useState<number>(8); // Diameter, Side, or Length
    const [originalDim2, setOriginalDim2] = useState<number>(8); // Width (only used for rectangle)

    const [desiredShape, setDesiredShape] = useState<PanShape>("rectangle");
    const [desiredDim1, setDesiredDim1] = useState<number>(9);
    const [desiredDim2, setDesiredDim2] = useState<number>(13);

    const calculateArea = (shape: PanShape, d1: number, d2: number) => {
        if (shape === "round") return Math.PI * Math.pow(d1 / 2, 2);
        if (shape === "square") return d1 * d1;
        if (shape === "rectangle") return d1 * d2;
        return 1;
    };

    const results = useMemo(() => {
        const originalArea = calculateArea(originalShape, originalDim1, originalDim2);
        const desiredArea = calculateArea(desiredShape, desiredDim1, desiredDim2);
        
        const scaleFactor = desiredArea / originalArea;
        const percentageIncrease = (scaleFactor * 100);

        return {
            originalArea: originalArea.toFixed(1),
            desiredArea: desiredArea.toFixed(1),
            scaleFactor: scaleFactor.toFixed(2),
            multiplier: percentageIncrease.toFixed(0),
        };
    }, [originalShape, originalDim1, originalDim2, desiredShape, desiredDim1, desiredDim2]);

    return (
        <div className="calculator-core-layout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Original Pan */}
                <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2 shadow-sm">1</span>
                        Original Pan Size
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shape</label>
                            <select
                                value={originalShape}
                                onChange={(e) => setOriginalShape(e.target.value as PanShape)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="round">Round Pan</option>
                                <option value="square">Square Pan</option>
                                <option value="rectangle">Rectangular / Sheet Pan</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {originalShape === "round" ? "Diameter (in)" : originalShape === "square" ? "Side (in)" : "Length (in)"}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    value={originalDim1}
                                    onChange={(e) => setOriginalDim1(parseFloat(e.target.value) || 1)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                                />
                            </div>
                            {originalShape === "rectangle" && (
                                <div className="input-group">
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Width (in)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={originalDim2}
                                        onChange={(e) => setOriginalDim2(parseFloat(e.target.value) || 1)}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desired Pan */}
                <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2 shadow-sm">2</span>
                        Desired Pan Size
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shape</label>
                            <select
                                value={desiredShape}
                                onChange={(e) => setDesiredShape(e.target.value as PanShape)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="round">Round Pan</option>
                                <option value="square">Square Pan</option>
                                <option value="rectangle">Rectangular / Sheet Pan</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {desiredShape === "round" ? "Diameter (in)" : desiredShape === "square" ? "Side (in)" : "Length (in)"}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.5"
                                    value={desiredDim1}
                                    onChange={(e) => setDesiredDim1(parseFloat(e.target.value) || 1)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                                />
                            </div>
                            {desiredShape === "rectangle" && (
                                <div className="input-group">
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Width (in)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        value={desiredDim2}
                                        onChange={(e) => setDesiredDim2(parseFloat(e.target.value) || 1)}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Results Section */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Recipe Multiplier</p>
                        <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                            {results.scaleFactor}×
                        </h2>
                    </div>
                    
                    <div className="hidden md:flex text-blue-300 dark:text-blue-700">
                        <span className="text-4xl">&rarr;</span>
                    </div>

                    <div className="text-center md:text-left flex-1 max-w-sm border-l md:border-l-0 border-blue-200 dark:border-blue-800 pl-6 md:pl-0">
                        <p className="text-gray-700 dark:text-gray-300">
                            To fit your new pan perfectly, multiply <strong>every ingredient</strong> in your recipe by exactly <span className="font-bold bg-blue-100 dark:bg-blue-800/50 px-2 py-0.5 rounded text-blue-800 dark:text-blue-300">{results.scaleFactor}</span>.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Original Volume: {results.originalArea} sq in. &rarr; New Volume: {results.desiredArea} sq in.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
