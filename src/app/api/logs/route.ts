import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = 'https://bin-reminder-app.vercel.app/api/logs';

export async function GET() {
  try {
    const response = await axios.get(API_URL);
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
        return new NextResponse(error.response?.data || 'Error fetching logs', {
            status: error.response?.status || 500,
        });
    }
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
