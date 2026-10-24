import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

// Colors matching the site
export const colors = {
  background: '#F6F4EF',
  text: '#1A1917',
  accent: '#46FF10',
};

const fontBold = fs.readFileSync(path.join(process.cwd(), 'src/assets/fonts/DMSans-Bold.woff'));
const fontRegular = fs.readFileSync(path.join(process.cwd(), 'src/assets/fonts/DMSans-Regular.woff'));

export async function renderPng(markup: any, width: number, height: number) {
  const svg = await satori(markup, {
    width,
    height,
    fonts: [
      { name: 'DM Sans', data: fontBold, weight: 700, style: 'normal' },
      { name: 'DM Sans', data: fontRegular, weight: 400, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });

  return resvg.render().asPng();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
