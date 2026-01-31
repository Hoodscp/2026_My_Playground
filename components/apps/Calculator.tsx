"use client";

import React, { useState } from 'react';
import { Delete, Eraser } from 'lucide-react';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);

    const handleNumber = (num: string) => {
        if (waitingForNewValue) {
            setDisplay(num);
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const handleOperator = (op: string) => {
        const currentValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(currentValue);
        } else if (operator) {
            const result = calculate(prevValue, currentValue, operator);
            setPrevValue(result);
            setDisplay(String(result));
        }

        setWaitingForNewValue(true);
        setOperator(op);
    };

    const calculate = (a: number, b: number, op: string) => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return a / b;
            default: return b;
        }
    };

    const handleEqual = () => {
        if (operator && prevValue !== null) {
            const currentValue = parseFloat(display);
            const result = calculate(prevValue, currentValue, operator);
            setDisplay(String(result));
            setPrevValue(null);
            setOperator(null);
            setWaitingForNewValue(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    const handleBackspace = () => {
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    };

    const buttons = [
        { label: 'C', onClick: handleClear, className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: <Delete size={18} />, onClick: handleBackspace, className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: '%', onClick: () => { }, className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: '÷', onClick: () => handleOperator('÷'), className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: '7', onClick: () => handleNumber('7'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '8', onClick: () => handleNumber('8'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '9', onClick: () => handleNumber('9'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '×', onClick: () => handleOperator('×'), className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: '4', onClick: () => handleNumber('4'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '5', onClick: () => handleNumber('5'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '6', onClick: () => handleNumber('6'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '-', onClick: () => handleOperator('-'), className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: '1', onClick: () => handleNumber('1'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '2', onClick: () => handleNumber('2'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '3', onClick: () => handleNumber('3'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '+', onClick: () => handleOperator('+'), className: 'bg-gray-100 hover:bg-gray-200 text-gray-900' },
        { label: '±', onClick: () => setDisplay(String(parseFloat(display) * -1)), className: 'bg-white hover:bg-gray-50 text-gray-900' },
        { label: '0', onClick: () => handleNumber('0'), className: 'bg-white hover:bg-gray-50 text-gray-900 font-bold' },
        { label: '.', onClick: () => !display.includes('.') && handleNumber('.'), className: 'bg-white hover:bg-gray-50 text-gray-900' },
        { label: '=', onClick: handleEqual, className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-[#f3f3f3]">
            {/* Display */}
            <div className="h-24 flex flex-col items-end justify-end px-4 py-2 select-none">
                <div className="text-gray-500 text-xs h-4">{prevValue} {operator}</div>
                <div className="text-4xl font-semibold text-gray-900 truncate w-full text-right">{display}</div>
            </div>

            {/* Keypad */}
            <div className="flex-1 grid grid-cols-4 gap-[1px] bg-gray-300 border-t border-gray-300">
                {buttons.map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.onClick}
                        className={`flex items-center justify-center text-lg active:opacity-80 transition-opacity ${btn.className}`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
