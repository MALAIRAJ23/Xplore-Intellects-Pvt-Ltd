import { useEffect, useMemo, useState } from 'react';
import Antigravity from './Antigravity';

function AuthAntigravity({ variant = 'access' }) {
  const [themeColors, setThemeColors] = useState({
    brand: '#0b8a72',
    brandDark: '#066451',
    ink: '#1d2a2f',
    ok: '#217a45'
  });

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setThemeColors({
      brand: root.getPropertyValue('--brand').trim() || '#0b8a72',
      brandDark: root.getPropertyValue('--brand-dark').trim() || '#066451',
      ink: root.getPropertyValue('--ink').trim() || '#1d2a2f',
      ok: root.getPropertyValue('--ok').trim() || '#217a45'
    });
  }, []);

  const particleColor = useMemo(() => {
    if (variant === 'admin') return themeColors.brandDark;
    if (variant === 'employee') return themeColors.ok;
    if (variant === 'register') return themeColors.ink;
    return themeColors.brand;
  }, [variant, themeColors]);

  return (
    <div className="auth-antigravity" aria-hidden="true">
      <Antigravity
        count={260}
        magnetRadius={6}
        ringRadius={7}
        waveSpeed={0.4}
        waveAmplitude={1}
        particleSize={1.2}
        lerpSpeed={0.05}
        color={particleColor}
        autoAnimate
        particleVariance={1}
        rotationSpeed={0}
        depthFactor={1}
        pulseSpeed={2.8}
        particleShape="capsule"
        fieldStrength={10}
      />
    </div>
  );
}

export default AuthAntigravity;
