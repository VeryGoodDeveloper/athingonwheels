"use client";

import { useState } from "react";

interface PaymentCalculatorProps {
  price: number;
}

export default function PaymentCalculator({ price }: PaymentCalculatorProps) {
  const [downPayment, setDownPayment] = useState(10000);
  const [interestRate, setInterestRate] = useState(8.0);
  const [loanTerm, setLoanTerm] = useState(60);

  // Calculate monthly payment
  const calculatePayment = () => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

    if (principal <= 0) return 0;
    if (interestRate === 0) return principal / numberOfPayments;

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return payment;
  };

  const monthlyPayment = calculatePayment();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-amber-500/40 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💳</span>
        <h3 className="text-xl font-bold text-white">Estimate Your Payment</h3>
      </div>

      <div className="space-y-4 mb-6">
        {/* Down Payment */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">Down Payment</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="1000"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">Interest Rate (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.1"
          />
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">Loan Term (months)</label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value={24}>24 months</option>
            <option value={36}>36 months</option>
            <option value={48}>48 months</option>
            <option value={60}>60 months</option>
            <option value={72}>72 months</option>
            <option value={84}>84 months</option>
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
        <p className="text-gray-300 text-sm mb-1">Estimated Monthly Payment</p>
        <p className="text-4xl font-bold text-white">
          ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<span className="text-xl text-gray-400">/mo</span>
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Payment calculated based on a {loanTerm} month loan with {interestRate}% interest and ${downPayment.toLocaleString()} down.
      </p>
    </div>
  );
}
