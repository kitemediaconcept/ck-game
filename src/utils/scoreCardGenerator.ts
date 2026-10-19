/**
 * Generates an elegant, high-resolution (1200x675) downloadable score card for winners.
 * Styled in clean white and gold luxury corporate theme matching mycorekraft.com
 */

import { getHamperDataUri } from './hamperArtwork';

export interface ScoreCardData {
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
  dateStr?: string;
  campaignUrl?: string;
}

export async function generateAndDownloadScoreCard(data: ScoreCardData): Promise<void> {
  const width = 1200;
  const height = 675;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background: Clean Studio Pure White with subtle warm tint
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.5, '#F8FAFC');
  bgGrad.addColorStop(1, '#F1F5F9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Decorative Borders
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Corner Ornaments
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.strokeStyle = '#FF4A68';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 24);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(42, 42, 0);
  drawCorner(width - 42, 42, 90);
  drawCorner(width - 42, height - 42, 180);
  drawCorner(42, height - 42, 270);

  // Brand Header
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 38px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText('corekraft', 90, 110);

  // Signature Coral Crown
  ctx.fillStyle = '#FF4A68';
  ctx.fillRect(90, 72, 18, 7);

  // Campaign Subhead
  ctx.fillStyle = '#64748B';
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('CHRISTMAS CAMPAIGN 2026 · MYCOREKRAFT.COM', 90, 142);

  // Main Trophy Headline
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 44px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText('YOU CRACKED THE CHRISTMAS BOX', 90, 220);

  ctx.fillStyle = '#64748B';
  ctx.font = '400 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText('Official Certificate of Challenge Completion', 90, 256);

  // Stats Grid Container (Crisp White Card with Slate Border)
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(90, 310, 560, 190, 20);
  ctx.fill();
  ctx.stroke();

  // Draw 3 Stats Columns
  const stats = [
    { label: 'COMPLETION TIME', val: `${data.timeSeconds}s`, color: '#FF4A68' },
    { label: 'MOVES MADE', val: `${data.moves}`, color: '#0F172A' },
    { label: 'HINTS USED', val: `${data.hintsUsed} / 2`, color: '#10B981' },
  ];

  stats.forEach((s, idx) => {
    const colX = 120 + idx * 180;
    ctx.fillStyle = '#64748B';
    ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillText(s.label, colX, 360);

    ctx.fillStyle = s.color;
    ctx.font = '800 40px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillText(s.val, colX, 420);
  });

  // Footer Note & Date
  const dateStr = data.dateStr || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText(`Verified on ${dateStr} · Calicut, Kerala · ${data.campaignUrl || 'https://mycorekraft.com'}`, 90, 570);

  // Seal Stamp on Right
  const sealX = 940;
  const sealY = 360;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 130, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner coral dashed circle
  ctx.beginPath();
  ctx.arc(sealX, sealY, 118, 0, Math.PI * 2);
  ctx.strokeStyle = '#FF4A68';
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  // Seal Text
  ctx.fillStyle = '#FF4A68';
  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CRACKED', sealX, sealY - 26);
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 36px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText(`${data.timeSeconds}s`, sealX, sealY + 16);
  ctx.fillStyle = '#64748B';
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillText('CHRISTMAS BOX', sealX, sealY + 44);

  ctx.textAlign = 'left';

  // Load and draw mini hamper artwork inside certificate
  const img = new Image();
  img.src = getHamperDataUri();
  await new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(700, 90, 180, 180, 20);
      ctx.clip();
      ctx.drawImage(img, 700, 90, 180, 180);
      ctx.restore();

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(700, 90, 180, 180, 20);
      ctx.stroke();
      resolve();
    };
    img.onerror = () => resolve();
  });

  // Download image
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `Corekraft_Christmas_Box_Victory_${data.timeSeconds}s.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
