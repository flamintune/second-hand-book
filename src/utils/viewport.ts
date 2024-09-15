export function setRootFontSize() {
  const baseWidth = 375; // Your design draft width
  const maxWidth = 1024;

  const calcSize = () => {
    const width = document.documentElement.clientWidth;
    const scale = Math.min(width / baseWidth, maxWidth / baseWidth);
    document.documentElement.style.fontSize = `${16 * scale}px`;
  };

  calcSize();
  window.addEventListener("resize", calcSize);
}
