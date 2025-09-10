import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductCardProps } from "../types/Product";

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col space-y-2">
      {/* Image Section */}
      <div
        onClick={handleClick}
        className="relative w-full h-48 cursor-pointer overflow-hidden rounded-lg"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Product Name */}
      <h3
        onClick={handleClick}
        className="text-lg font-medium text-gray-500 line-clamp-2 cursor-pointer hover:text-gray-200"
      >
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-xl font-bold text-green-600">${product.price}</p>
    </div>
  );
}
