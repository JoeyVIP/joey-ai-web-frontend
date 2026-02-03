'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectsAPI } from '@/lib/api';
import { useProgress } from '@/hooks/useProgress';
import type { Project } from '@/types';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const userId = typeof window !== 'undefined' ? parseInt(localStorage.getItem('user_id') || '1') : 1;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { logs, status, isComplete, error, isConnected } = useProgress(projectId, userId);

  useEffect(() => {
    if (!projectId) return;

    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const data = await projectsAPI.get(projectId, userId);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('載入專案失敗');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const info = {
      pending: { label: '待處理', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      running: { label: '執行中', color: 'bg-blue-100 text-blue-800', icon: '⚡' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: '✅' },
      failed: { label: '失敗', color: 'bg-red-100 text-red-800', icon: '❌' },
      cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800', icon: '🚫' },
    };

    return info[status as keyof typeof info] || info.pending;
  };

  const getLogIcon = (logType: string) => {
    const icons = {
      info: '📝',
      tool_use: '🔧',
      success: '✅',
      error: '❌',
    };
    return icons[logType as keyof typeof icons] || '📝';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">載入專案中...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">專案不存在</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回儀表板
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(status || project.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-gray-600">{project.description}</p>
              )}
            </div>
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：專案資訊 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">專案資訊</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">專案 ID</dt>
                  <dd className="text-gray-900 font-mono">#{project.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">建立時間</dt>
                  <dd className="text-gray-900">
                    {new Date(project.created_at).toLocaleString('zh-TW')}
                  </dd>
                </div>
                {project.started_at && (
                  <div>
                    <dt className="text-gray-500">開始時間</dt>
                    <dd className="text-gray-900">
                      {new Date(project.started_at).toLocaleString('zh-TW')}
                    </dd>
                  </div>
                )}
                {project.completed_at && (
                  <div>
                    <dt className="text-gray-500">完成時間</dt>
                    <dd className="text-gray-900">
                      {new Date(project.completed_at).toLocaleString('zh-TW')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 連線狀態 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">即時監控</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className={isConnected ? 'text-green-700' : 'text-gray-500'}>
                  {isConnected ? '已連線' : '未連線'}
                </span>
              </div>
            </div>

            {/* 任務描述 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">任務描述</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {project.task_prompt}
              </p>
            </div>
          </div>

          {/* 右側：即時日誌 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">執行日誌</h2>
                <p className="text-sm text-gray-500 mt-1">
                  即時顯示 Agent 執行步驟
                </p>
              </div>

              <div className="p-6">
                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">等待執行開始...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {logs.map((log, index) => (
                      <div
                        key={log.id || index}
                        className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-xl flex-shrink-0">
                          {getLogIcon(log.log_type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{log.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(log.created_at).toLocaleTimeString('zh-TW')}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* 執行中動畫 */}
                    {status === 'running' && !isComplete && (
                      <div className="flex gap-3 p-3 rounded-lg bg-blue-50">
                        <span className="text-xl">⚡</span>
                        <div className="flex-1">
                          <p className="text-sm text-blue-900">
                            執行中...
                          </p>
                          <div className="flex gap-1 mt-2">
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 完成訊息 */}
                {isComplete && (
                  <div className={`mt-6 p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                    <h3 className={`font-semibold mb-2 ${error ? 'text-red-900' : 'text-green-900'}`}>
                      {error ? '❌ 執行失敗' : '✅ 執行完成'}
                    </h3>
                    {error && (
                      <p className="text-sm text-red-800">{error}</p>
                    )}
                    {project.result_summary && (
                      <p className="text-sm text-green-800 whitespace-pre-wrap mt-2">
                        {project.result_summary}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
