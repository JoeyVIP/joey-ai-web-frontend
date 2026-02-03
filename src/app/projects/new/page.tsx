'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsAPI } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    task_prompt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.task_prompt) {
      alert('請填寫專案名稱和任務描述');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = parseInt(localStorage.getItem('user_id') || '1');
      const project = await projectsAPI.create(formData, userId);

      // Redirect to project detail page
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('建立專案失敗，請稍後再試');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            <h1 className="text-2xl font-bold text-gray-900">新建網站專案</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 專案名稱 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                專案名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="例如：太空貓咖啡館官網"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 專案描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                專案描述（選填）
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="簡短描述這個網站的用途"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 任務描述 */}
            <div>
              <label htmlFor="task_prompt" className="block text-sm font-medium text-gray-700 mb-2">
                建置需求 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="task_prompt"
                name="task_prompt"
                value={formData.task_prompt}
                onChange={handleChange}
                rows={12}
                placeholder={'請詳細描述您要建立的網站，例如：\n\n請建立一個太空貓咖啡館的官網，包含：\n\n1. 首頁：展示咖啡館特色、太空主題設計\n2. 關於我們：咖啡館故事、營業時間、地址\n3. 菜單：飲品、甜點、價格\n4. 預約：線上預約表單\n5. 聯絡我們：地圖、社群連結\n\n設計風格：\n- 主色調：深藍、紫色、金色\n- 科技感、夢幻、溫馨\n- 響應式設計（手機、平板、桌面）\n\n技術需求：\n- Next.js 14\n- Tailwind CSS\n- 部署到 Render'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                提示：越詳細的描述，AI 產生的網站就越符合您的需求
              </p>
            </div>

            {/* 提示卡片 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 建議包含的資訊：</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 網站類型（官網、電商、部落格等）</li>
                <li>• 需要的頁面（首頁、關於、聯絡等）</li>
                <li>• 設計風格（色調、氛圍）</li>
                <li>• 特殊功能（表單、地圖、動畫等）</li>
                <li>• 技術框架（Next.js、React 等）</li>
              </ul>
            </div>

            {/* 按鈕 */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    建立中...
                  </>
                ) : (
                  '建立專案並開始執行'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
