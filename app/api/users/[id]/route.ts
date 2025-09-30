import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    const user = verifyToken(token!);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const { name, email, role, email_verified } = await request.json();
    const userId = parseInt(params.id);

    // Check if email already exists for other users
    const existingResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email sudah digunakan oleh user lain' },
        { status: 400 }
      );
    }

    const emailVerifiedAt = email_verified ? new Date() : null;

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, email_verified_at = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, name, email, role, email_verified_at, created_at',
      [name, email, role, emailVerifiedAt, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    const user = verifyToken(token!);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const userId = parseInt(params.id);

    // Check if user exists
    const existingResult = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete user (CASCADE will handle related data)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}