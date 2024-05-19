import '../index.sass';

import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import AppWrapper from '../components/app';

export default function App({ roomId }: { roomId: string }) {
  useEffect(() => {
    if (window) {
      if (isNaN(Number(roomId))) {
        navigate('/');
      }
    }
  }, []);

  if (isNaN(Number(roomId))) {
    return <React.Fragment />
  }

  return <AppWrapper roomId={ !isNaN(Number(roomId)) ? Number(roomId) : 0 } />
}
