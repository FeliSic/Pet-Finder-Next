// components/MapPickerWrapper.tsx
'use client';
import dynamic from 'next/dynamic';

const MapPickerWrap = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <div style={{ height: '300px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando mapa...</div>,
});

export default MapPickerWrap;