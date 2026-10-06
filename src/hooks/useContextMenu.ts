'use client';

import { useEffect, useState, useCallback } from 'react';

export function useContextMenu() {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [contextData, setContextData] = useState<unknown>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, data?: unknown) => {
    e.preventDefault();
    e.stopPropagation();
    setClicked(true);
    setPoints({ x: e.pageX, y: e.pageY });
    setContextData(data || null);
  }, []);

  const handleClick = useCallback(() => {
    setClicked(false);
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return {
    clicked,
    setClicked,
    points,
    handleContextMenu,
    contextData,
  };
}
