import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

export function GET() {
  const file = readFileSync(join(process.cwd(), 'swagger.yaml'), 'utf8');
  const spec = load(file);
  return NextResponse.json(spec);
}
