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
    const email = (body.email || '').trim().toLowerCase();
    const currentPassword = (body.currentPassword || '').trim();

    if (!email || !currentPassword) {
      return Response.json({ success: false, error: 'Email and current password are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
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

    const existingAdmin = await Admin.findOne({ email, _id: { $ne: admin._id } });

    if (existingAdmin) {
      return Response.json({ success: false, error: 'This email is already in use by another admin' }, { status: 409 });
    }

    admin.email = email;
    await admin.save();

    return Response.json({
      success: true,
      message: 'Admin ID updated successfully',
      admin: {
        email: admin.email,
        id: admin._id.toString(),
      },
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
