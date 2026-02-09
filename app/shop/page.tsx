"use client";

import Link from "next/link";
import { useState } from "react";
import { mockVehicles, getUniqueMakes, filterVehicles } from "@/lib/mockData";

export default function ShopPage() {
  const [filters, setFilters] = useState({
    make: "all",
    minPrice: 0,
    maxPrice: 600000,
    minYear: 2015,
    maxYear: 2024,
    maxMileage: 100000,
    condition: "all" as "all" | "new" | "used",
  });

  const makes = getUniqueMakes(mockVehicles);
  const filteredVehicles = filterVehicles(mockVehicles, filters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            ATOW
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/shop" className="text-blue-400 font-semibold">
              Shop
            </Link>
            <Link href="/sell" className="hover:text-purple-400 transition-colors">
              Sell
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 py-16 border-b border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Shop Our Inventory</h1>
          <p className="text-xl text-gray-300">Premium vehicles, unbeatable prices</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Filters</h2>

              {/* Make Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Make</label>
                <select
                  value={filters.make}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Makes</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Price Range: ${filters.minPrice.toLocaleString()} - {filters.maxPrice >= 600000 ? '$600,000+' : '$' + filters.maxPrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="600000"
                  step="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Year Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Year: {filters.minYear} - {filters.maxYear}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minYear}
                    onChange={(e) => setFilters({ ...filters, minYear: parseInt(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                    min="2000"
                    max="2024"
                  />
                  <input
                    type="number"
                    value={filters.maxYear}
                    onChange={(e) => setFilters({ ...filters, maxYear: parseInt(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                    min="2000"
                    max="2024"
                  />
                </div>
              </div>

              {/* Mileage */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Max Mileage: {filters.maxMileage.toLocaleString()} mi
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={filters.maxMileage}
                  onChange={(e) => setFilters({ ...filters, maxMileage: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Condition */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Condition</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="all"
                      checked={filters.condition === "all"}
                      onChange={(e) => setFilters({ ...filters, condition: e.target.value as any })}
                      className="mr-2"
                    />
                    All
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="new"
                      checked={filters.condition === "new"}
                      onChange={(e) => setFilters({ ...filters, condition: e.target.value as any })}
                      className="mr-2"
                    />
                    New
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="used"
                      checked={filters.condition === "used"}
                      onChange={(e) => setFilters({ ...filters, condition: e.target.value as any })}
                      className="mr-2"
                    />
                    Used
                  </label>
                </div>
              </div>

              <button
                onClick={() => setFilters({
                  make: "all",
                  minPrice: 0,
                  maxPrice: 600000,
                  minYear: 2015,
                  maxYear: 2024,
                  maxMileage: 100000,
                  condition: "all",
                })}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Vehicle Grid */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filteredVehicles.length} Vehicle{filteredVehicles.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/shop/${vehicle.slug}`}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105"
                >
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <img
                      src={vehicle.thumbnailUrl}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                    {vehicle.condition === "new" && (
                      <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    {vehicle.trim && (
                      <p className="text-gray-400 text-sm mb-3">{vehicle.trim}</p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-400">
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {vehicle.mileage.toLocaleString()} mi
                      </span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition-all text-center">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400 mb-4">No vehicles found matching your filters</p>
                <button
                  onClick={() => setFilters({
                    make: "all",
                    minPrice: 0,
                    maxPrice: 600000,
                    minYear: 2015,
                    maxYear: 2024,
                    maxMileage: 100000,
                    condition: "all",
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
