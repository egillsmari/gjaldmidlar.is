import Image from "next/image";

import { useAssetImage } from "@/hooks/useAssetImage";
import { AssetType } from "@/lib/types";

interface AssetImageProps {
  code: string;
  type: AssetType;
  size?: number;
  className?: string;
}

export function AssetImage({
  code,
  type,
  size = 24,
  className = "",
}: AssetImageProps) {
  const { imageUrl, metalColor } = useAssetImage(code, type);

  // For metals, render a colored div
  if (type === "Metal" && metalColor) {
    return (
      <div
        className={`rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size, backgroundColor: metalColor }}
        title={`${code} color`}
      />
    );
  }

  // Show image if we have it
  if (imageUrl) {
    return (
      <div
        className={`rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          alt={`${code} icon`}
          className="object-cover w-full h-full"
          height={size}
          src={imageUrl}
          width={size}
        />
      </div>
    );
  }

  // Fallback to placeholder
  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs ${className}`}
      style={{ width: size, height: size }}
    >
      {code.substring(0, 2)}
    </div>
  );
}
