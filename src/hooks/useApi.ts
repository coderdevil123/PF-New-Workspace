import { useState, useEffect, useCallback, useRef } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

type CacheEntry = { data: unknown; expiresAt: number };
const cache    = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

async function apiFetch(url: string, options?: RequestInit): Promise<unknown> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err?.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function useApi<T = unknown>(
  url: string,
  options: { ttl?: number; disabled?: boolean; deps?: unknown[] } = {}
) {
  const { ttl = 30_000, disabled = false } = options;
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(!disabled);
  const [error, setError]     = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetch_ = useCallback(async (force = false) => {
    if (disabled) return;

    if (!force) {
      const cached = cache.get(url);
      if (cached && cached.expiresAt > Date.now()) {
        setData(cached.data as T);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let promise = inflight.get(url);
      if (!promise) {
        promise = apiFetch(url);
        inflight.set(url, promise);
        promise.finally(() => inflight.delete(url));
      }

      const result = await promise;
      cache.set(url, { data: result, expiresAt: Date.now() + ttl });

      if (mountedRef.current) {
        setData(result as T);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }
  }, [url, ttl, disabled]);

  useEffect(() => {
    mountedRef.current = true;
    fetch_();
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, disabled, ...(options.deps || [])]);

  return { data, loading, error, refetch: () => fetch_(true) };
}

export async function apiMutate(
  url: string,
  method: 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  body?: unknown
): Promise<unknown> {
  const result = await apiFetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Bust related cache entries
  const baseUrl = '/' + url.split('/').slice(1, 3).join('/');
  for (const key of cache.keys()) {
    if (key.startsWith(baseUrl)) cache.delete(key);
  }

  return result;
}

export function bustCache(urlPrefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(urlPrefix)) cache.delete(key);
  }
}