'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { apiRequest } from '@/services/api';

export default function UploadResumePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      await apiRequest('/api/auth/me/resume', {
        method: 'POST',
        body: formData,
        auth: true
      });
      router.push('/jobs');
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <div style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'var(--color-surface)',
            }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>
                {file ? file.name : "Drag and drop your resume here, or click to browse"}
              </p>
              <Input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }} 
                id="resume-upload" 
              />
              <Button as="label" htmlFor="resume-upload" variant="secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                Browse Files
              </Button>
            </div>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="ghost" onClick={() => router.back()} type="button" disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={!file || isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
