'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [config, setConfig] = useState<any>({
    email: 'hello@creu.vn',
    location: 'Thu Duc, TP.HCM',
    instagram: 'https://instagram.com',
    behance: 'https://behance.net',
    facebook: 'https://facebook.com',
  });

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.siteConfig) setConfig(data.siteConfig);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="ft">
      <div>
        <div className="ft-logo">CREU Studio</div>
        <div className="ft-copy">&copy; 2026</div>
      </div>
      <a href={`mailto:${config.email}`} className="ft-em">
        {config.email}
      </a>
      <div className="ft-loc">{config.location}</div>
      <div className="ft-soc">
        <a href={config.instagram || '#'} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href={config.behance || '#'} target="_blank" rel="noopener noreferrer">
          Behance
        </a>
        <a href={config.facebook || '#'} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </div>
    </footer>
  );
}
