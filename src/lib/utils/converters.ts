export function formatMs(ms: number) {
    const secs = (ms / 1000).toFixed(3);
    return `${(parseInt(secs) < 10 ? "0" : "") + secs}`;
  }