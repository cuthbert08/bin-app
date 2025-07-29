import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

const API_URL = 'https://bin-reminder-app.vercel.app/api/documents/upload';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return new NextResponse('No file found in the request', { status: 400 });
        }
        
        // Stream the file content directly to the backend
        const response = await axios.post(API_URL, file.stream(), {
            headers: {
                'Content-Type': file.type,
                'X-File-Name': file.name, // Send filename in a custom header
            },
        });
        
        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Error in upload proxy route:', error);
        if (axios.isAxiosError(error) && error.response) {
            // Forward the error from the Python service
            return new NextResponse(error.response.data?.error || 'Error uploading file', {
                status: error.response.status || 500,
            });
        }
        // Generic error for other cases
        return new NextResponse('An unexpected error occurred during file upload', { status: 500 });
    }
}
