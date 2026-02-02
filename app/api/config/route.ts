import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'token-config.json');
    
    if (!fs.existsSync(configPath)) {
      return NextResponse.json(
        { error: 'Token not configured yet' },
        { status: 404 }
      );
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    // Return only public info
    return NextResponse.json({
      mintAddress: config.mintAddress,
      network: config.network,
      decimals: config.decimals,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load config', details: error.message },
      { status: 500 }
    );
  }
}