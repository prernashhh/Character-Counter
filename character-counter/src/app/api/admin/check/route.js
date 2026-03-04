import connectDB from '@/lib/db';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await connectDB();

    const admins = await Admin.find({}).select('-password');

    return Response.json({
      success: true,
      count: admins.length,
      admins: admins,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
