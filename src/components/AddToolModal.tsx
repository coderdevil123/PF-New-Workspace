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

  const inputClass =
  "w-full rounded-lg border border-border bg-light-gray px-4 py-2 text-sm " +
  "text-heading-dark placeholder:text-muted-text " +
  "focus:outline-none focus:ring-2 focus:ring-mint-accent/30 " +
  "dark:bg-dark-hover dark:border-dark-border dark:text-white dark:placeholder:text-dark-muted";
    
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
      <DialogContent className="w-full max-w-lg rounded-2xl
        bg-white text-heading-dark
        dark:bg-dark-card dark:text-white
        border border-border dark:border-dark-border
        shadow-xl
        space-y-5">
        {/* ✅ Accessibility fix */}
        <DialogTitle className="font-display text-2xl font-normal text-heading-dark dark:text-white">
          {tool ? 'Edit Tool' : 'Add Tool'}
        </DialogTitle>

        <input
          placeholder="Tool Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="Tool URL"
          value={toolUrl}
          onChange={(e) => setToolUrl(e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="YouTube Tutorial URL (optional)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className={inputClass}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[80px]`}
        />

        <label className="block">
        <span className="mb-2 block text-sm font-medium text-heading-dark dark:text-dark-text">
          Tool Image
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="
            w-full cursor-pointer rounded-xl border border-dashed border-border
            bg-light-gray dark:bg-dark-hover
            px-4 py-6 text-sm text-muted-text
            hover:border-mint-accent/50
          "
          />
        </label>

        {imageFile && (
          <p className="text-xs text-muted-text dark:text-dark-muted">
            Selected: {imageFile.name}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="
              rounded-full
              border-border
              text-heading-dark dark:text-dark-text
              hover:bg-gray-100 dark:hover:bg-dark-hover
            "
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="
              rounded-full
              bg-mint-accent text-forest-dark
              hover:bg-mint-accent/90
              shadow-lg shadow-mint
            "
            >
              {loading ? 'Saving...' : tool ? 'Update Tool' : 'Add Tool'}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
