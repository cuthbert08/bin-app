'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { reportIssue, uploadDocument } from '@/lib/api';
import Link from 'next/link';

export function ReportIssueForm() {
    const [name, setName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';
            // 1. Upload image if it exists
            if (imageFile) {
                try {
                    const uploadResponse = await uploadDocument(imageFile);
                    imageUrl = uploadResponse.url;
                } catch (error) {
                    toast({
                        title: 'Image Upload Failed',
                        description: 'Could not upload the image. Please try again.',
                        variant: 'destructive',
                    });
                    setLoading(false);
                    return;
                }
            }
            
            // 2. Submit the issue data
            await reportIssue({ 
                name, 
                flat_number: flatNumber, 
                description,
                image_url: imageUrl,
            });

            setIsSubmitted(true);

        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: 'Could not report the issue. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };
    
    if (isSubmitted) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Thank You!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground'>Your maintenance issue has been reported successfully. The property owner has been notified.</p>
                     <Link href="/login" passHref>
                        <Button variant="link" className="mt-4 px-0">Go back to login</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Report a Maintenance Issue</CardTitle>
                <CardDescription>
                    Please fill out the form below to report an issue. The owner will be notified automatically.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="flat_number">Flat Number</Label>
                            <Input
                                id="flat_number"
                                value={flatNumber}
                                onChange={(e) => setFlatNumber(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Issue Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Please describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="picture">Upload a Picture (Optional)</Label>
                        <Input 
                            id="picture" 
                            type="file" 
                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                            accept="image/*"
                            disabled={loading}
                         />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Report Issue'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
