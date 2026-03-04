import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      return Response.json({
        success: true,
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          createdAt: existingAdmin.createdAt,
        },
      });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      email: 'admin@example.com',
      password: hashedPassword,
    });

    const savedAdmin = await admin.save();

    return Response.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        email: savedAdmin.email,
        createdAt: savedAdmin.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return Response.json({
        success: false,
        error: 'Admin with this email already exists',
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
