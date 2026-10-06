'use client';

import { useState } from 'react';

export default function CalculatorApp() {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleNumber = (num: string) => {
        if (display === '0' || display === 'Error') {
            setDisplay(num);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOperator = (op: string) => {
        if (display !== 'Error') {
            setEquation(equation + display + op);
            setDisplay('0');
        }
    };

    const calculate = () => {
        try {
            // Using a simple and secure parsing logic instead of eval/Function
            const fullEq = equation + display;

            // Basic math parsing logic for safety without bringing in external dependencies
            const tokens = fullEq.split(/([+\-*/])/).map(t => t.trim());

            if (tokens.length < 3) {
                setDisplay(display);
                setEquation('');
                return;
            }

            let result = parseFloat(tokens[0]);

            for (let i = 1; i < tokens.length; i += 2) {
                const operator = tokens[i];
                const nextNum = parseFloat(tokens[i + 1]);

                if (isNaN(nextNum)) continue;

                switch (operator) {
                    case '+': result += nextNum; break;
                    case '-': result -= nextNum; break;
                    case '*': result *= nextNum; break;
                    case '/':
                        if (nextNum === 0) throw new Error("Division by zero");
                        result /= nextNum;
                        break;
                }
            }

            setDisplay(String(result));
            setEquation('');
        } catch {
            setDisplay('Error');
            setEquation('');
        }
    };

    const clear = () => {
        setDisplay('0');
        setEquation('');
    };

    const buttonClass = "p-4 text-xl rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors border border-white/5 bg-white/5 flex items-center justify-center font-medium";
    const opClass = "p-4 text-xl rounded-xl bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 active:bg-orange-500/40 transition-colors border border-orange-500/20 flex items-center justify-center font-medium";

    return (
        <div className="h-full flex flex-col bg-black/40 text-white p-4 font-sans">
            <div className="flex-1 flex flex-col justify-end items-end p-4 mb-4 bg-black/40 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                <div className="text-white/50 text-sm h-6 font-mono tracking-wider">{equation}</div>
                <div className="text-4xl font-light tracking-wider truncate w-full text-right">{display}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 h-2/3">
                <button onClick={clear} className={`${buttonClass} text-red-400 col-span-2 shadow-sm`}>AC</button>
                <button onClick={() => setDisplay(String(-parseFloat(display)))} className={`${buttonClass} shadow-sm`}>+/-</button>
                <button onClick={() => handleOperator('/')} className={`${opClass} shadow-sm`}>÷</button>

                <button onClick={() => handleNumber('7')} className={`${buttonClass} shadow-sm`}>7</button>
                <button onClick={() => handleNumber('8')} className={`${buttonClass} shadow-sm`}>8</button>
                <button onClick={() => handleNumber('9')} className={`${buttonClass} shadow-sm`}>9</button>
                <button onClick={() => handleOperator('*')} className={`${opClass} shadow-sm`}>×</button>

                <button onClick={() => handleNumber('4')} className={`${buttonClass} shadow-sm`}>4</button>
                <button onClick={() => handleNumber('5')} className={`${buttonClass} shadow-sm`}>5</button>
                <button onClick={() => handleNumber('6')} className={`${buttonClass} shadow-sm`}>6</button>
                <button onClick={() => handleOperator('-')} className={`${opClass} shadow-sm`}>-</button>

                <button onClick={() => handleNumber('1')} className={`${buttonClass} shadow-sm`}>1</button>
                <button onClick={() => handleNumber('2')} className={`${buttonClass} shadow-sm`}>2</button>
                <button onClick={() => handleNumber('3')} className={`${buttonClass} shadow-sm`}>3</button>
                <button onClick={() => handleOperator('+')} className={`${opClass} shadow-sm`}>+</button>

                <button onClick={() => handleNumber('0')} className={`${buttonClass} shadow-sm col-span-2`}>0</button>
                <button onClick={() => handleNumber('.')} className={`${buttonClass} shadow-sm`}>.</button>
                <button onClick={calculate} className={`${opClass} bg-orange-500/80 text-white hover:bg-orange-500 shadow-md`}>=</button>
            </div>
        </div>
    );
}
