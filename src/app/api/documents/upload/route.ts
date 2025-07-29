import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';
import { Readable } from 'stream';

const API_URL = 'https://bin-reminder-app.vercel.app/api/documents/upload';

// Helper function to convert a ReadableStream to a Buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        if (value) {
            chunks.push(value);
        }
    }

    return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return new NextResponse('No file found in the request', { status: 400 });
        }
        
        // We need to forward the multipart data to the Python service.
        // The easiest way is to re-create the FormData and let axios handle headers.
        const backendFormData = new FormData();
        
        // Convert the file stream to a Blob so we can append it with a filename
        const fileBuffer = await streamToBuffer(file.stream());
        const fileBlob = new Blob([fileBuffer], { type: file.type });

        backendFormData.append('file', fileBlob, file.name);

        const response = await axios.post(API_URL, backendFormData, {
            headers: {
                // Axios will set the 'Content-Type' to 'multipart/form-data' with the correct boundary
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
