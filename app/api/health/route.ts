import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
export async function GET(){try{await query('SELECT 1');return NextResponse.json({ok:true,status:'healthy',version:'0.1-alpha'});}catch{return NextResponse.json({ok:false,status:'unhealthy'},{status:503});}}
