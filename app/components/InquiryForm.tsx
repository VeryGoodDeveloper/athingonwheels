"use client";

import { useState } from "react";
import { Vehicle } from "@/types/vehicle";

interface InquiryFormProps {
  vehicle: Vehicle;
}

export default function InquiryForm({ vehicle }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle.id,
          vehicleSlug: vehicle.slug,
          vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          vehiclePrice: vehicle.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit inquiry");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Check if Your Thing is Available</h2>
      
      {status === "success" ? (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 text-center">
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">Thing Status: Checking!</h3>
          <p className="text-gray-300">
            We're checking on your {vehicle.year} {vehicle.make} {vehicle.model}.
            Our team will contact you within 24 hours with availability.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-blue-400 hover:text-blue-300 font-semibold"
          >
            Check Another Thing
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Info Display */}
          <div className="bg-gray-800/70 rounded-lg p-4 mb-6 border border-gray-600">
            <p className="text-sm text-gray-400 mb-1">Your thing:</p>
            <p className="text-lg font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && <span className="text-gray-400"> {vehicle.trim}</span>}
            </p>
            <p className="text-blue-400 font-semibold">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-300">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-300">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="(123) 456-7890"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-300">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="Any questions about your thing..."
            />
          </div>

          {/* Error Message */}
          {status === "error" && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg"
          >
            {status === "submitting" ? "Checking..." : "Check on My Thing"}
          </button>

          {/* Additional Contact Options */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <p className="text-center text-gray-400 text-sm mb-3">
              Or contact us directly:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:00000000"
                className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all text-center"
              >
                📞 Call Us
              </a>
              <a
                href="mailto:sales@jsautohaus.com"
                className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all text-center"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
