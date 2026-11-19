import Link from "next/link";

type BrandLogoProps = {
  /* Where the logo links to. Omit to render without a link. */
  href?: string;
  /* Icon size in px. */
  size?: number;
  /* Classes for the icon, e.g. responsive sizes like "md:h-9 md:w-9". */
  iconClassName?: string;
  /* Show the "KayaHub" wordmark next to the icon. */
  showText?: boolean;
  /* Classes for the wordmark, so each place keeps its own text style. */
  textClassName?: string;
  /* Classes for the wrapper (link or span). */
  className?: string;
};

export default function BrandLogo({
  href,
  size = 32,
  iconClassName = "",
  showText = true,
  textClassName = "",
  className = "flex items-center gap-2",
}: BrandLogoProps) {
  const content = (
    <>
      {/*
       * Plain <img> matches the rest of the app. An SVG gains nothing
       * from next/image optimisation.
       */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kayahub-icon.svg"
        alt={showText ? "" : "KayaHub"}
        width={size}
        height={size}
        className={`shrink-0 ${iconClassName}`}
      />

      {showText && (
        <span className={textClassName}>
          KayaHub
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <span className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {content}
    </Link>
  );
}
