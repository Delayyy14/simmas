import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const user = verifyToken(token!);
    
    if (!user || user.role !== 'siswa') {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // Get siswa data
    const siswaResult = await pool.query(
      'SELECT * FROM siswa WHERE user_id = $1',
      [user.id]
    );

    if (siswaResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Data siswa tidak ditemukan' }, { status: 404 });
    }

    const siswaData = siswaResult.rows[0];

    // Get total pendaftaran magang
    const pendaftaranResult = await pool.query(
      'SELECT COUNT(*) as count FROM magang WHERE siswa_id = $1',
      [siswaData.id]
    );

    const totalPendaftaran = parseInt(pendaftaranResult.rows[0].count);
    const maxPendaftaran = 3; // Batas maksimal pendaftaran

    return NextResponse.json({
      success: true,
      data: {
        ...siswaData,
        total_pendaftaran: totalPendaftaran,
        max_pendaftaran: maxPendaftaran
      }
    });
  } catch (error) {
    console.error('Get siswa profile error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}