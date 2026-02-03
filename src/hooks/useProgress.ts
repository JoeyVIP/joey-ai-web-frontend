import { useEffect, useState, useCallback } from 'react';
import { projectsAPI } from '@/lib/api';
import type { SSEEvent, TaskLog } from '@/types';

export function useProgress(projectId: number, userId: number = 1) {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [status, setStatus] = useState<string>('pending');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSSE = useCallback(() => {
    if (!projectId) return;

    const streamURL = projectsAPI.getStreamURL(projectId, userId);
    const eventSource = new EventSource(streamURL);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('[SSE] Connected to progress stream');
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);

        switch (data.type) {
          case 'log':
            if (data.message && data.log_type && data.timestamp) {
              setLogs((prev) => [
                ...prev,
                {
                  id: data.log_id || Date.now(),
                  project_id: projectId,
                  message: data.message || '',
                  log_type: data.log_type || 'info',
                  created_at: data.timestamp || new Date().toISOString(),
                },
              ]);
            }
            break;

          case 'status':
            if (data.status) {
              setStatus(data.status);
            }
            break;

          case 'complete':
            setIsComplete(true);
            if (data.status) {
              setStatus(data.status);
            }
            if (data.error_message) {
              setError(data.error_message);
            }
            eventSource.close();
            setIsConnected(false);
            break;
        }
      } catch (err) {
        console.error('[SSE] Failed to parse event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[SSE] Connection error:', err);
      setIsConnected(false);
      eventSource.close();
    };

    return eventSource;
  }, [projectId, userId]);

  useEffect(() => {
    const eventSource = connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
        setIsConnected(false);
      }
    };
  }, [connectSSE]);

  return {
    logs,
    status,
    isComplete,
    error,
    isConnected,
  };
}
