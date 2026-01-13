import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: string;
}

function extractYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
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
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName('');
    setToolUrl('');
    setYoutubeUrl('');
  }

  async function handleAddTool() {
    if (!name || !toolUrl || !category) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tools`,
        {
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
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error('Failed to add tool:', err);
        return;
      }

      resetForm();
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  }

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
          Add Tool
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

        <Button onClick={handleAddTool} disabled={loading}>
          {loading ? 'Adding...' : 'Add Tool'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
