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

export async function PUT(request) {
  try {
    const token = (await cookies()).get('admin_token')?.value;
    const auth = ensureAdmin(token);

    if (!auth.valid || !auth.payload?.adminId) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = (body.currentPassword || '').trim();
    const newPassword = (body.newPassword || '').trim();

    if (!currentPassword || !newPassword) {
      return Response.json({ success: false, error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return Response.json({ success: false, error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findById(auth.payload.adminId);

    if (!admin) {
      return Response.json({ success: false, error: 'Admin account not found' }, { status: 404 });
    }

    const matches = await bcrypt.compare(currentPassword, admin.password);

    if (!matches) {
      return Response.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    const samePassword = await bcrypt.compare(newPassword, admin.password);

    if (samePassword) {
      return Response.json({ success: false, error: 'New password must be different from current password' }, { status: 400 });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return Response.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
