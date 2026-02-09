"use client";

import Link from "next/link";
import { useState } from "react";

export default function SellPage() {
  const [formData, setFormData] = useState({
    // Vehicle info
    vin: "",
    licensePlate: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    // Owner info
    name: "",
    email: "",
    phone: "",
    // Preferences
    tradeIn: false,
    comments: "",
  });

  const [useManual, setUseManual] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend/API
    console.log("Form submitted:", formData);
    alert("Thank you! We'll contact you within 24 hours with an offer.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            ATOW
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/shop" className="hover:text-blue-400 transition-colors">
              Shop
            </Link>
            <Link href="/sell" className="text-purple-400 font-semibold">
              Sell
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 py-16 border-b border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Sell or Trade Your Car</h1>
          <p className="text-xl text-gray-300">Get top dollar in 3 easy steps</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="text-5xl mb-4 text-blue-400">①</div>
              <h3 className="text-2xl font-bold mb-3">Submit Info</h3>
              <p className="text-gray-400">
                Enter your vehicle details or VIN for an instant estimate
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="text-5xl mb-4 text-purple-400">②</div>
              <h3 className="text-2xl font-bold mb-3">Get Estimate</h3>
              <p className="text-gray-400">
                Receive a competitive offer within 24 hours
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="text-5xl mb-4 text-green-400">③</div>
              <h3 className="text-2xl font-bold mb-3">Schedule Visit</h3>
              <p className="text-gray-400">
                Confirm condition and get paid or trade-in
              </p>
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <section className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-8 text-center">Get Your Instant Quote</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* VIN/License Plate Section */}
              {!useManual ? (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    VIN or License Plate Number
                  </label>
                  <input
                    type="text"
                    value={formData.vin || formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    placeholder="Enter VIN or License Plate"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setUseManual(true)}
                    className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Don't have VIN? Enter manually →
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <button
                      type="button"
                      onClick={() => setUseManual(false)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      ← Back to VIN/License Plate
                    </button>
                  </div>

                  {/* Manual Entry Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Make</label>
                      <input
                        type="text"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        placeholder="e.g., Honda"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Model</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="e.g., Accord"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Year</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="e.g., 2020"
                        min="1990"
                        max="2024"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Mileage</label>
                      <input
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                        placeholder="e.g., 45000"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Contact Info */}
              <div className="border-t border-gray-700 pt-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Your Contact Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade-in Option */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tradeIn}
                    onChange={(e) => setFormData({ ...formData, tradeIn: e.target.checked })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-semibold">I'm interested in trading in for another vehicle</span>
                </label>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Any additional details about your vehicle..."
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 text-lg"
              >
                Get My Free Quote →
              </button>
            </form>
          </div>
        </section>

        {/* Why Sell to ATOW */}
        <section className="mt-20">
          <h2 className="text-4xl font-bold mb-10 text-center">Why Sell to ATOW?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Fast, Fair Offers</h3>
              <p className="text-gray-400">Competitive pricing within 24 hours</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">No Hidden Fees</h3>
              <p className="text-gray-400">What we quote is what you get</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">We Handle Paperwork</h3>
              <p className="text-gray-400">Stress-free process from start to finish</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-2">Trade-in Options</h3>
              <p className="text-gray-400">Apply your value toward your next ride</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
