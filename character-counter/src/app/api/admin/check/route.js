import Admin from '@/models/Admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { default: connectDB } = await import('@/lib/db');
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
