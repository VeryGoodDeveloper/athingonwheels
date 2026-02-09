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

      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
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

        <div className="grid lg:grid-cols-2 gap-10 mb-10">
          {/* Image Gallery */}
          <div>
            <ImageGallery
              images={vehicle.images}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          </div>

          {/* Vehicle Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.trim && (
              <p className="text-xl text-gray-400 mb-6">{vehicle.trim}</p>
            )}

            {/* Condition Badge */}
            {vehicle.condition === "new" && (
              <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                NEW VEHICLE
              </div>
            )}

            {/* Price */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-700">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-blue-400">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.originalPrice &&
                  vehicle.originalPrice > vehicle.price && (
                    <span className="text-2xl text-gray-500 line-through">
                      ${vehicle.originalPrice.toLocaleString()}
                    </span>
                  )}
              </div>
              {vehicle.originalPrice &&
                vehicle.originalPrice > vehicle.price && (
                  <p className="text-green-400 font-semibold">
                    Save ${(vehicle.originalPrice - vehicle.price).toLocaleString()}!
                  </p>
                )}
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Mileage</p>
                <p className="text-xl font-bold">
                  {vehicle.mileage.toLocaleString()} mi
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Condition</p>
                <p className="text-xl font-bold capitalize">
                  {vehicle.condition}
                </p>
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
                  <p className="text-gray-400 text-sm mb-1">Exterior</p>
                  <p className="text-xl font-bold">{vehicle.exteriorColor}</p>
                </div>
              )}
              {vehicle.interiorColor && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Interior</p>
                  <p className="text-xl font-bold">{vehicle.interiorColor}</p>
                </div>
              )}
            </div>

            {/* VIN */}
            {vehicle.vin && (
              <div className="mb-6 text-sm bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                <span className="text-gray-400">VIN:</span>{" "}
                <span className="font-mono text-gray-300">{vehicle.vin}</span>
              </div>
            )}

            {/* Quick Contact */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:6092456634"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all text-center text-lg"
              >
                📞 Call Now: (609) 245-6634
              </a>
            </div>

            {/* Location */}
            <p className="text-gray-400 text-sm text-center">
              📍 Located in {vehicle.location}
            </p>
          </div>
        </div>

        {/* Description */}
        {vehicle.description && (
          <div className="mb-10 bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>
        )}

        {/* Features */}
        {vehicle.features.length > 0 && (
          <div className="mb-10 bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Features & Options</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-blue-400 text-xl">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        <div className="mb-10">
          <InquiryForm vehicle={vehicle} />
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mb-10">
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
                    {similar.condition === "new" && (
                      <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        NEW
                      </span>
                    )}
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
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors"
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
  );
}
