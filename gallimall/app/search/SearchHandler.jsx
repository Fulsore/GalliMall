'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SearchHandler({ onQuery }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const query = searchParams.get('query') || '';
    onQuery(query);
  }, [searchParams]);
  return null;
}
