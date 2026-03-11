export function isOpenNow(opening: string, closing: string) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Yakutsk' }));
  const [oh, om] = opening.split(':').map(Number);
  const [ch, cm] = closing.split(':').map(Number);
  const start = new Date(now); start.setHours(oh, om, 0, 0);
  const end = new Date(now); end.setHours(ch, cm, 0, 0);
  const open = now >= start && now <= end;
  return { open, now, start, end };
}
