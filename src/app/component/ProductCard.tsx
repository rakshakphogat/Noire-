import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductCardProps } from "../types/Product";

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col space-y-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div
        onClick={handleClick}
        className="relative w-full h-40 sm:h-48 cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Name */}
      <h3
        onClick={handleClick}
        className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 dark:text-gray-200 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 leading-tight"
      >
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
        ${product.price}
      </p>
    </div>
  );
}
