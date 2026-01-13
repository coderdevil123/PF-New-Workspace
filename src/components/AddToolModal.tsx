import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: string;
}

function extractYoutubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/,
  );
  return match ? match[1] : '';
}

export default function AddToolModal({
  open,
  onClose,
  onSuccess,
  category,
}: Props) {
  const [name, setName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  async function handleAddTool() {
  if (!name || !toolUrl || !category) return;

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tools`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      name,
      url: toolUrl,
      category,
      tutorial_video: extractYoutubeId(youtubeUrl),
      image: '',
      image_light: '',
      image_dark: '',
    }),
  });

  if (!res.ok) {
    console.error('Failed to add tool');
    return;
  }

  resetForm();   // ✅ clear inputs
  onSuccess();   // reload tools
  onClose();     // close modal
}

function resetForm() {
  setName('');
  setToolUrl('');
  setYoutubeUrl('');
}

  return (
    <Dialog open={open} onOpenChange={(v) => {
          if (!v) resetForm();   //reset on close
          onClose();
        }}>
      <DialogContent className="space-y-4">
        <h2 className="text-xl font-semibold">Add Tool</h2>

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

        <Button onClick={handleAddTool}>
          Add Tool
        </Button>
      </DialogContent>
    </Dialog>
  );
}
