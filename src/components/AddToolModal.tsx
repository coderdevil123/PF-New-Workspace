import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useEffect } from 'react';
// import { supabase } from '../lib/supabase';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: string;
  tool?: any;
}

function extractYoutubeId(url: string) {
  try {
    const u = new URL(url);

    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }

    // youtube.com/watch?v=VIDEO_ID
    if (u.searchParams.get('v')) {
      return u.searchParams.get('v')!;
    }

    // youtube.com/embed/VIDEO_ID
    if (u.pathname.includes('/embed/')) {
      return u.pathname.split('/embed/')[1];
    }

    return '';
  } catch {
    return '';
  }
}

export default function AddToolModal({
  open,
  onClose,
  onSuccess,
  category,
  tool,
}: Props) {
  const [name, setName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (tool) {
      setName(tool.name);
      setToolUrl(tool.url);
      setYoutubeUrl(tool.tutorial_video || '');
      setDescription(tool.description || '');
    }
  }, [tool]);
  
  function resetForm() {
    setName('');
    setToolUrl('');
    setYoutubeUrl('');
    setDescription('');
    setImageFile(null);
  }
  
  async function handleSubmit() {
  if (!name || !toolUrl || !category) return;

  setLoading(true);

  const payload = {
    name,
    description,
    url: toolUrl,
    category,
    tutorial_video: extractYoutubeId(youtubeUrl),
    // image will be added later (optional)
  };

  const endpoint = tool
    ? `${import.meta.env.VITE_BACKEND_URL}/api/tools/${tool.id}`
    : `${import.meta.env.VITE_BACKEND_URL}/api/tools`;

  const method = tool ? 'PUT' : 'POST';

  const res = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });

  setLoading(false);

  if (!res.ok) {
    console.error('Tool save failed');
    return;
  }

  resetForm();
  onSuccess();
  onClose();
}

  
  
  
  // async function uploadImage(file: File) {
    //   const fileName = `${Date.now()}-${file.name}`;
    
    //   const { data, error } = await supabase.storage
    //     .from('tool-images')
    //     .upload(fileName, file, { upsert: true });
    
    //   if (error) throw error;
    
    //   return supabase.storage
    //     .from('tool-images')
    //     .getPublicUrl(fileName).data.publicUrl;
    // }
    
    return (
      <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="space-y-4">
        {/* ✅ Accessibility fix */}
        <DialogTitle className="text-xl font-semibold">
          {tool ? 'Edit Tool' : 'Add Tool'}
        </DialogTitle>

        <input
          placeholder="Tool Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <input
          placeholder="Tool URL"
          value={toolUrl}
          onChange={(e) => setToolUrl(e.target.value)}
          className="input"
        />

        <input
          placeholder="YouTube Tutorial URL (optional)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="input"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input min-h-[80px]"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="input"
        />

        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? tool ? 'Saving...' : 'Adding...'
            : tool ? 'Save Changes' : 'Add Tool'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
