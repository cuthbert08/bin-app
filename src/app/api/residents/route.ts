import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = 'https://bin-reminder-app.vercel.app/api/residents';

export async function GET() {
  try {
    const response = await axios.get(API_URL);
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
        return new NextResponse(error.response?.data || 'Error fetching residents', {
            status: error.response?.status || 500,
        });
    }
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await axios.post(API_URL, body);
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return new NextResponse(error.response?.data || 'Error adding resident', {
                status: error.response?.status || 500,
            });
        }
        return new NextResponse('An unexpected error occurred', { status: 500 });
    }
}
