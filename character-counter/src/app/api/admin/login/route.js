import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not defined in environment variables');
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('[API] Creating response and setting cookie...');
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    console.log('[API] Token:', token.substring(0, 20) + '...');
    console.log('[API] NODE_ENV:', process.env.NODE_ENV);
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    console.log('[API] Cookie set on response');
    console.log('[API] Response headers before return:', response.headers.getSetCookie());
    
    return response;

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
