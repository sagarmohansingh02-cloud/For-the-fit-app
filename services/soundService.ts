const sounds: { [key: string]: HTMLAudioElement } = {};
const SOUND_ENABLED_KEY = 'forthefit-sound-enabled';

// Pre-load audio elements using base64 data URIs to avoid network requests
const soundData: { [key: string]: string } = {
  click: 'data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YVgAAACAgICAwMDAxMTEzMzQ0NTU2Njc4ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGprbG1ucHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+A==',
  upload: 'data:audio/wav;base64,UklGRkIAAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YUYAAAB/f3+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==',
  success: 'data:audio/wav;base64,UklGRqgAAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YZQAAACfn5+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6f',
  toggle: 'data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YVwAAACcnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbg==',
};

const initializeSounds = () => {
  if (typeof Audio === 'undefined') return;
  for (const key in soundData) {
    sounds[key] = new Audio(soundData[key]);
    sounds[key].volume = 0.3; // Lower volume for less intrusive sounds
  }
};

initializeSounds();

export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const storedValue = localStorage.getItem(SOUND_ENABLED_KEY);
  // Sound is enabled by default if no setting is stored
  return storedValue === null || storedValue === 'true';
};

export const toggleSound = (): boolean => {
  const enabled = !isSoundEnabled();
  localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  return enabled;
};

export const playSound = (type: 'click' | 'upload' | 'success' | 'toggle') => {
  if (isSoundEnabled()) {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        // Autoplay can be blocked by the browser, we can ignore these errors.
        if (error.name !== 'NotAllowedError') {
            console.warn("Sound play failed:", error)
        }
      });
    }
  }
};
