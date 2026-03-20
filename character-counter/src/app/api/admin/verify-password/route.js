import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function ensureAdmin(token) {
  if (!token) return { valid: false };
  return verifyToken(token);
}

export async function POST(request) {
  try {
    const token = (await cookies()).get('admin_token')?.value;
    const auth = ensureAdmin(token);

    if (!auth.valid || !auth.payload?.adminId) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = (body.currentPassword || '').trim();

    if (!currentPassword) {
      return Response.json({ success: false, error: 'Current password is required' }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findById(auth.payload.adminId);

    if (!admin) {
      return Response.json({ success: false, error: 'Admin account not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isPasswordValid) {
      return Response.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    return Response.json({ success: true, message: 'Password verified' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
