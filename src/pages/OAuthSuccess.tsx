import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      // safety fallback
      navigate('/login');
      return;
    }

    // ✅ store token
    localStorage.setItem('pf_token', token);

    // OPTIONAL: decode / validate later

    // 🚀 redirect to workspace
    navigate('/workspace');
  }, [navigate]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '40vh' }}>
      Logging you in...
    </div>
  );
}
