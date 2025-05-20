import { useState } from "react";
import { Download } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface ImageWithDownloadProps {
  height?: number;
  width?: number;
  src: string;
  alt: string;
  fileName?: string;
  className?: string;
  downloadIconSize?: number;
  overlayClassName?: string;
  buttonClassName?: string;
}

export default function ImageWithDownload({
  height = 300,
  width = 300,
  src,
  alt,
  fileName = "image.png",
  className = "rounded-lg",
  downloadIconSize = 24,
  overlayClassName = "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg transition-opacity duration-200",
  buttonClassName = "p-3 h-fit bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors",
}: ImageWithDownloadProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative inline-block flex-shrink-0"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={src}
        alt={alt}
        height={height}
        width={width}
        className={className}
      />

      {isHovering && (
        <div className={overlayClassName}>
          <Button
            variant={"ghost"}
            onClick={handleDownload}
            className={buttonClassName}
            title="Download image"
          >
            <Download size={downloadIconSize} />
          </Button>
        </div>
      )}
    </div>
  );
}
