import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface Logbook {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  file?: string;
  status_verifikasi: "pending" | "disetujui" | "ditolak";
}

// GET semua logbook
export async function GET() {
  try {
    const { rows } = await pool.query<Logbook>(
      "SELECT * FROM logbook ORDER BY tanggal DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET logbook error:", error);
    return NextResponse.json({ error: "Failed to fetch logbook" }, { status: 500 });
  }
}

// POST tambah logbook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { magang_id, tanggal, kegiatan, kendala, file } = body;

    const { rows } = await pool.query<Logbook>(
      `INSERT INTO logbook (magang_id, tanggal, kegiatan, kendala, file, status_verifikasi)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [magang_id, tanggal, kegiatan, kendala, file]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("POST logbook error:", error);
    return NextResponse.json({ error: "Failed to insert logbook" }, { status: 500 });
  }
}
