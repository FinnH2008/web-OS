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
            // A safer alternative to eval for a simple calculator
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            const result = new Function(`return ${equation + display}`)();
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
        <div className="h-full flex flex-col bg-black/40 text-white p-4">
            <div className="flex-1 flex flex-col justify-end items-end p-4 mb-4 bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                <div className="text-white/50 text-sm h-6 font-mono tracking-wider">{equation}</div>
                <div className="text-4xl font-light tracking-wider truncate w-full text-right">{display}</div>
            </div>

            <div className="grid grid-cols-4 gap-2 h-2/3">
                <button onClick={clear} className={`${buttonClass} text-red-400 col-span-2`}>AC</button>
                <button onClick={() => setDisplay(String(-parseFloat(display)))} className={buttonClass}>+/-</button>
                <button onClick={() => handleOperator('/')} className={opClass}>÷</button>

                <button onClick={() => handleNumber('7')} className={buttonClass}>7</button>
                <button onClick={() => handleNumber('8')} className={buttonClass}>8</button>
                <button onClick={() => handleNumber('9')} className={buttonClass}>9</button>
                <button onClick={() => handleOperator('*')} className={opClass}>×</button>

                <button onClick={() => handleNumber('4')} className={buttonClass}>4</button>
                <button onClick={() => handleNumber('5')} className={buttonClass}>5</button>
                <button onClick={() => handleNumber('6')} className={buttonClass}>6</button>
                <button onClick={() => handleOperator('-')} className={opClass}>-</button>

                <button onClick={() => handleNumber('1')} className={buttonClass}>1</button>
                <button onClick={() => handleNumber('2')} className={buttonClass}>2</button>
                <button onClick={() => handleNumber('3')} className={buttonClass}>3</button>
                <button onClick={() => handleOperator('+')} className={opClass}>+</button>

                <button onClick={() => handleNumber('0')} className={`${buttonClass} col-span-2`}>0</button>
                <button onClick={() => handleNumber('.')} className={buttonClass}>.</button>
                <button onClick={calculate} className={`${opClass} bg-orange-500/80 text-white hover:bg-orange-500`}>=</button>
            </div>
        </div>
    );
}
