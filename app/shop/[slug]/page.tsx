import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchVehicleBySlug, fetchVehicles } from "@/lib/dataSource";
import { Vehicle } from "@/types/vehicle";
import ImageGallery from "@/app/components/ImageGallery";
import InquiryForm from "@/app/components/InquiryForm";

// ISR Configuration: Revalidate every hour, generate pages on-demand
export const revalidate = 3600; // 1 hour
export const dynamicParams = true; // Allow dynamic slugs

// Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await fetchVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | ATOW",
    };
  }

  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""} | ATOW`,
    description: vehicle.description || `Buy this ${vehicle.year} ${vehicle.make} ${vehicle.model} for $${vehicle.price.toLocaleString()}. ${vehicle.mileage.toLocaleString()} miles. Located in ${vehicle.location}.`,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await fetchVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  // Get similar vehicles (same make or similar price range)
  const { vehicles: allVehicles } = await fetchVehicles();
  const similarVehicles = allVehicles
    .filter(
      (v) =>
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
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
          >
            ATOW
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              href="/shop"
              className="text-blue-400 font-semibold"
            >
              Shop
            </Link>
            <Link
              href="/sell"
              className="hover:text-purple-400 transition-colors"
            >
              Sell
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          {" / "}
          <Link href="/shop" className="hover:text-gray-300">
            Shop
          </Link>
          {" / "}
          <span className="text-white">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div>
            <ImageGallery
              images={vehicle.images}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          </div>

          {/* Car Name & Trim */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.trim && (
              <p className="text-lg text-gray-400">{vehicle.trim}</p>
            )}
          </div>

          {/* Basic Information - Consolidated */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            
            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-700">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl md:text-5xl font-bold text-blue-400">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${vehicle.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <p className="text-green-400 font-semibold text-sm">
                  Save ${(vehicle.originalPrice - vehicle.price).toLocaleString()}!
                </p>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {/* Stock Number */}
              {vehicle.stock && (
                <div>
                  <p className="text-gray-400 mb-1">Stock #</p>
                  <p className="text-white font-semibold">{vehicle.stock}</p>
                </div>
              )}
              
              {/* Body Type */}
              {vehicle.bodyType && (
                <div>
                  <p className="text-gray-400 mb-1">Body Type</p>
                  <p className="text-white font-semibold">{vehicle.bodyType}</p>
                </div>
              )}
              
              {/* Condition */}
              <div>
                <p className="text-gray-400 mb-1">Condition</p>
                <p className="text-white font-semibold capitalize">{vehicle.condition}</p>
              </div>
              
              {/* Mileage */}
              <div>
                <p className="text-gray-400 mb-1">Mileage</p>
                <p className="text-white font-semibold">{vehicle.mileage.toLocaleString()} mi</p>
              </div>
              
              {/* Engine */}
              {vehicle.engine && (
                <div>
                  <p className="text-gray-400 mb-1">Engine</p>
                  <p className="text-white font-semibold">{vehicle.engine}</p>
                </div>
              )}
              
              {/* Transmission */}
              {vehicle.transmission && (
                <div>
                  <p className="text-gray-400 mb-1">Transmission</p>
                  <p className="text-white font-semibold">{vehicle.transmission}</p>
                </div>
              )}
              
              {/* Drivetrain */}
              {vehicle.drivetrain && (
                <div>
                  <p className="text-gray-400 mb-1">Drivetrain</p>
                  <p className="text-white font-semibold">{vehicle.drivetrain}</p>
                </div>
              )}
              
              {/* Fuel Type */}
              {vehicle.fuelType && (
                <div>
                  <p className="text-gray-400 mb-1">Fuel Type</p>
                  <p className="text-white font-semibold">{vehicle.fuelType}</p>
                </div>
              )}
              
              {/* City MPG */}
              {vehicle.mpgCity !== undefined && vehicle.mpgCity > 0 && (
                <div>
                  <p className="text-gray-400 mb-1">City MPG</p>
                  <p className="text-white font-semibold">{vehicle.mpgCity}</p>
                </div>
              )}
              
              {/* Highway MPG */}
              {vehicle.mpgHighway !== undefined && vehicle.mpgHighway > 0 && (
                <div>
                  <p className="text-gray-400 mb-1">Highway MPG</p>
                  <p className="text-white font-semibold">{vehicle.mpgHighway}</p>
                </div>
              )}
              
              {/* Exterior Color */}
              {vehicle.exteriorColor && (
                <div>
                  <p className="text-gray-400 mb-1">Exterior Color</p>
                  <p className="text-white font-semibold">{vehicle.exteriorColor}</p>
                </div>
              )}
              
              {/* Interior Color */}
              {vehicle.interiorColor && (
                <div>
                  <p className="text-gray-400 mb-1">Interior Color</p>
                  <p className="text-white font-semibold">{vehicle.interiorColor}</p>
                </div>
              )}
              
              {/* Doors */}
              {vehicle.doors && (
                <div>
                  <p className="text-gray-400 mb-1">Doors</p>
                  <p className="text-white font-semibold">{vehicle.doors}</p>
                </div>
              )}
            </div>

            {/* VIN - Small at bottom */}
            {vehicle.vin && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-500 text-xs">
                  VIN: <span className="font-mono">{vehicle.vin}</span>
                </p>
              </div>
            )}
          </div>

          {/* Quick Contact */}
          <div className="space-y-3">
            <a
              href="tel:00000000"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all text-center text-lg"
            >
              📞 Call Now: 00000000
            </a>
            <p className="text-gray-400 text-sm text-center">
              📍 Located in {vehicle.location}
            </p>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Features */}
          {vehicle.features.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Features & Options</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-blue-400">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry Form */}
          <div>
            <InquiryForm vehicle={vehicle} />
          </div>

          {/* Similar Vehicles */}
          {similarVehicles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                      {similar.condition === "new" && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">
                        {similar.year} {similar.make} {similar.model}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-400">
                          ${similar.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-xs">
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
          <div className="text-center py-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
