import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';

export default function AddToolModal({ open, onClose, onSuccess, category }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [image, setImage] = useState('');

  function extractYoutubeId(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  }

  async function handleAddTool() {
    if (!name || !url) return alert('Name & URL required');

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name,
        url,
        tutorial_video: extractYoutubeId(youtubeUrl),
        category,
        image,
        image_light: image,
        image_dark: image,
      }),
    });

    onSuccess(); // reload tools
    onClose();

    setName('');
    setUrl('');
    setYoutubeUrl('');
    setImage('');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-semibold">Add Tool</h2>

        <input
          placeholder="Tool Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input"
        />

        <input
          placeholder="Tool URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="input"
        />

        <input
          placeholder="YouTube Tutorial URL"
          value={youtubeUrl}
          onChange={e => setYoutubeUrl(e.target.value)}
          className="input"
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="input"
        />

        <Button onClick={handleAddTool}>
          Add Tool
        </Button>
      </DialogContent>
    </Dialog>
  );
}
