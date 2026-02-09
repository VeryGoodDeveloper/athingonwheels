import Link from "next/link";
import { mockVehicles } from "@/lib/mockData";

export default function Home() {
  // Get first 3 vehicles as featured
  const featuredVehicles = mockVehicles.slice(0, 3);

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
            <Link href="/sell" className="hover:text-purple-400 transition-colors">
              Sell
            </Link>
            <Link 
              href="/sell" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            A Thing On Wheels
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Your Next Ride Awaits
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Premium vehicles, handpicked for style, power, and performance. 
            Whether you're buying or selling, we make it fast, easy, and unforgettable.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Shop Inventory →
            </Link>
            <Link 
              href="/sell"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Sell Your Car →
            </Link>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10 text-center">Featured Vehicles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
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
                  <h3 className="text-2xl font-bold mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  {vehicle.trim && (
                    <p className="text-gray-400 mb-2">{vehicle.trim}</p>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold text-blue-400">
                      ${vehicle.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      {vehicle.mileage.toLocaleString()} mi
                    </span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all">
                    View Details →
                  </button>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/shop"
              className="inline-block text-blue-400 hover:text-blue-300 font-semibold text-lg"
            >
              View All Inventory →
            </Link>
          </div>
        </section>

        {/* Why Choose ATOW */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-10 text-center">Why Choose ATOW?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Handpicked Selection</h3>
              <p className="text-gray-400">Every vehicle carefully selected for quality</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
              <p className="text-gray-400">Transparent pricing, no hidden fees</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Easy Process</h3>
              <p className="text-gray-400">Buy or sell in just a few simple steps</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Fast Service</h3>
              <p className="text-gray-400">Quick turnaround, no waiting around</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-800 text-center text-gray-500 text-sm">
          <div className="flex justify-center gap-8 mb-6">
            <Link href="/shop" className="hover:text-gray-300">Shop</Link>
            <Link href="/sell" className="hover:text-gray-300">Sell</Link>
            <Link href="#" className="hover:text-gray-300">About</Link>
            <Link href="#" className="hover:text-gray-300">Contact</Link>
          </div>
          <p>&copy; 2026 A Thing On Wheels (ATOW). All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
