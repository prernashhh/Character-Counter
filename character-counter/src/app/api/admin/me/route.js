import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return Response.json({ authenticated: false });
    }

    const { valid, payload } = verifyToken(token);

    if (!valid) {
      return Response.json({ authenticated: false });
    }

    return Response.json({
      authenticated: true,
      admin: {
        email: payload.email,
        id: payload.adminId,
      },
    });
  } catch (error) {
    return Response.json({ authenticated: false });
  }
}
