import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchVehicleBySlug, fetchVehicles } from "@/lib/dataSource";
import { Vehicle } from "@/types/vehicle";
import ImageGallery from "@/app/components/ImageGallery";
import InquiryForm from "@/app/components/InquiryForm";
import PaymentCalculator from "@/app/components/PaymentCalculator";
import ExpandableDescription from "@/app/components/ExpandableDescription";

// ISR Configuration
export const revalidate = 3600;
export const dynamicParams = true;

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

  // Get similar vehicles
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
    <div className="min-h-screen bg-black text-white">
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
            <Link href="/shop" className="text-blue-400 font-semibold">
              Shop
            </Link>
            <Link href="/sell" className="hover:text-purple-400 transition-colors">
              Sell
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          {" / "}
          <Link href="/shop" className="hover:text-gray-300">Shop</Link>
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

          {/* Price */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-700/30 shadow-2xl">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl md:text-6xl font-bold text-white">
                ${vehicle.price.toLocaleString()}
              </span>
              {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                <span className="text-2xl text-gray-400 line-through">
                  ${vehicle.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
              <p className="text-amber-400 font-semibold">
                Save ${(vehicle.originalPrice - vehicle.price).toLocaleString()}!
              </p>
            )}
          </div>

          {/* Basic Information - iOS Glassy Style */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
              {vehicle.stock && (
                <span className="text-sm text-gray-400">Stock # {vehicle.stock}</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Mileage */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                <p className="text-gray-300 text-sm mb-1">Mileage</p>
                <p className="text-xl font-bold text-white">{vehicle.mileage.toLocaleString()} mi</p>
              </div>
              
              {/* Condition */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                <p className="text-gray-300 text-sm mb-1">Condition</p>
                <p className="text-xl font-bold text-white capitalize">{vehicle.condition}</p>
              </div>

              {/* Body Type */}
              {vehicle.bodyType && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Body Type</p>
                  <p className="text-xl font-bold text-white">{vehicle.bodyType}</p>
                </div>
              )}
              
              {/* Transmission */}
              {vehicle.transmission && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Transmission</p>
                  <p className="text-lg font-bold text-white">{vehicle.transmission}</p>
                </div>
              )}
              
              {/* Engine - Full Width */}
              {vehicle.engine && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30 col-span-2">
                  <p className="text-gray-300 text-sm mb-1">Engine</p>
                  <p className="text-lg font-bold text-white">{vehicle.engine}</p>
                </div>
              )}
              
              {/* Drivetrain */}
              {vehicle.drivetrain && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Drivetrain</p>
                  <p className="text-lg font-bold text-white">{vehicle.drivetrain}</p>
                </div>
              )}
              
              {/* Fuel Type */}
              {vehicle.fuelType && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Fuel Type</p>
                  <p className="text-lg font-bold text-white">{vehicle.fuelType}</p>
                </div>
              )}
              
              {/* MPG */}
              {(vehicle.mpgCity !== undefined && vehicle.mpgCity > 0) || (vehicle.mpgHighway !== undefined && vehicle.mpgHighway > 0) ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30 col-span-2">
                  <p className="text-gray-300 text-sm mb-1">Fuel Economy</p>
                  <p className="text-lg font-bold text-white">
                    {vehicle.mpgCity || 0} city / {vehicle.mpgHighway || 0} highway MPG
                  </p>
                </div>
              ) : null}
              
              {/* Exterior Color */}
              {vehicle.exteriorColor && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Exterior</p>
                  <p className="text-lg font-bold text-white">{vehicle.exteriorColor}</p>
                </div>
              )}
              
              {/* Interior Color */}
              {vehicle.interiorColor && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Interior</p>
                  <p className="text-lg font-bold text-white">{vehicle.interiorColor}</p>
                </div>
              )}
              
              {/* Doors */}
              {vehicle.doors && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">Doors</p>
                  <p className="text-lg font-bold text-white">{vehicle.doors}</p>
                </div>
              )}
              
              {/* VIN */}
              {vehicle.vin && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-gray-700/30">
                  <p className="text-gray-300 text-sm mb-1">VIN</p>
                  <p className="text-white font-mono text-xs break-all">{vehicle.vin}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="space-y-3">
            <a
              href="tel:00000000"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all text-center text-lg shadow-lg"
            >
              Call Now: 00000000
            </a>
            <p className="text-gray-400 text-sm text-center">
              Located in {vehicle.location}
            </p>
          </div>

          {/* Payment Calculator */}
          <PaymentCalculator price={vehicle.price} />

          {/* Description */}
          {vehicle.description && (
            <ExpandableDescription description={vehicle.description} />
          )}

          {/* Inquiry Form */}
          <div>
            <InquiryForm vehicle={vehicle} />
          </div>

          {/* Similar Vehicles */}
          {similarVehicles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6 text-white">Similar Vehicles</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {similarVehicles.map((similar) => (
                  <Link
                    key={similar.id}
                    href={`/shop/${similar.slug}`}
                    className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/30 hover:border-amber-500 transition-all transform hover:scale-105"
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
                      <h3 className="text-lg font-bold mb-2 text-white">
                        {similar.year} {similar.make} {similar.model}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-400">
                          ${similar.price.toLocaleString()}
                        </span>
                        <span className="text-gray-300 text-xs">
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
