/**
 * Scanlines at 4%, a slow rolling beam, and a vignette so the corners fall off
 * like a real tube. All three are removed under prefers-reduced-motion.
 */
export function CRT() {
  return (
    <>
      <div aria-hidden className="crt" />
      <div aria-hidden className="crt-beam" />
      <div aria-hidden className="crt-vignette" />
    </>
  );
}
