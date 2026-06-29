const FLATICON_ICONS = {
  instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
};

export default function SocialBrandIcon({
  type,
  className = "h-4 w-4",
}: {
  type: keyof typeof FLATICON_ICONS;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-contain bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${FLATICON_ICONS[type]})` }}
    />
  );
}
