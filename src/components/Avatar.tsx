interface AvatarProps {
  name?: string;              // user name
  imageUrl?: string | null;   // optional image URL
  size?: number;              // size in pixels (default 32)
  bgColor?: string;           // Tailwind background color class (default "bg-indigo-600")
  textColor?: string;         // Tailwind text color class (default "text-white")
}

export default function Avatar({
  name,
  imageUrl,
  size = 32,
  bgColor = "bg-gray-400",
  textColor = "text-white",
}: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || "User avatar"}
        style={{ width: size, height: size }}
        className="rounded-full object-cover bg-white dark:bg-gray-800"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full ${bgColor} ${textColor} font-semibold dark:bg-gray-700 dark:text-white`}
    >
      {initial}
    </div>
  );
}
