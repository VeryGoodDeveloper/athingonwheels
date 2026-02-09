import Link from "next/link";
import { notFound } from "next/navigation";
import { mockVehicles } from "@/lib/mockData";
import { Vehicle } from "@/types/vehicle";

// Generate static params for all vehicles (optional, for SSG)
export async function generateStaticParams() {
  return mockVehicles.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

// Fetch vehicle data
async function getVehicle(slug: string): Promise<Vehicle | null> {
  // TODO: Fetch from API when data integration is complete
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/${slug}`);
  // if (!response.ok) return null;
  // return response.json();
  
  // For now, use mock data
  return mockVehicles.find((v) => v.slug === slug) || null;
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    notFound();
  }

  // Get similar vehicles (same make or similar price range)
  const similarVehicles = mockVehicles
    .filter((v) => 
      v.id !== vehicle.id && 
      (v.make === vehicle.make || 
       Math.abs(v.price - vehicle.price) < 10000)
    )
    .slice(0, 3);

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

      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          {" / "}
          <Link href="/shop" className="hover:text-gray-300">Shop</Link>
          {" / "}
          <span className="text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full aspect-video object-cover"
              />
              {vehicle.condition === "new" && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  NEW
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images.slice(1).map((image, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                      src={image}
                      alt={`${vehicle.make} ${vehicle.model} - Image ${index + 2}`}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.trim && (
              <p className="text-xl text-gray-400 mb-6">{vehicle.trim}</p>
            )}

            {/* Price */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-700">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-blue-400">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${vehicle.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <p className="text-green-400 font-semibold">
                  Save ${(vehicle.originalPrice - vehicle.price).toLocaleString()}!
                </p>
              )}
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Mileage</p>
                <p className="text-xl font-bold">{vehicle.mileage.toLocaleString()} mi</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Condition</p>
                <p className="text-xl font-bold capitalize">{vehicle.condition}</p>
              </div>
              {vehicle.transmission && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Transmission</p>
                  <p className="text-xl font-bold">{vehicle.transmission}</p>
                </div>
              )}
              {vehicle.fuelType && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Fuel Type</p>
                  <p className="text-xl font-bold">{vehicle.fuelType}</p>
                </div>
              )}
              {vehicle.exteriorColor && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Exterior Color</p>
                  <p className="text-xl font-bold">{vehicle.exteriorColor}</p>
                </div>
              )}
              {vehicle.interiorColor && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Interior Color</p>
                  <p className="text-xl font-bold">{vehicle.interiorColor}</p>
                </div>
              )}
            </div>

            {/* VIN */}
            {vehicle.vin && (
              <div className="mb-6 text-sm">
                <span className="text-gray-400">VIN:</span>{" "}
                <span className="font-mono text-gray-300">{vehicle.vin}</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 mb-6">
              <Link
                href={`/contact?vehicle=${vehicle.slug}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all text-center text-lg"
              >
                Inquire About This Vehicle
              </Link>
              <a
                href="tel:6092456634"
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all text-center"
              >
                Call: (609) 245-6634
              </a>
            </div>

            {/* Location */}
            <p className="text-gray-400 text-sm">
              📍 Located in {vehicle.location}
            </p>
          </div>
        </div>

        {/* Description */}
        {vehicle.description && (
          <div className="mt-10 bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed">{vehicle.description}</p>
          </div>
        )}

        {/* Features */}
        {vehicle.features.length > 0 && (
          <div className="mt-10 bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Features & Options</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Similar Vehicles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarVehicles.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/shop/${similar.slug}`}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105"
                >
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <img
                      src={similar.thumbnailUrl}
                      alt={`${similar.year} ${similar.make} ${similar.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {similar.year} {similar.make} {similar.model}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-400">
                        ${similar.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {similar.mileage.toLocaleString()} mi
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Shop */}
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block text-blue-400 hover:text-blue-300 font-semibold text-lg"
          >
            ← Back to Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
