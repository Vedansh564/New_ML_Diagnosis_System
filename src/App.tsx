import { useState } from 'react';
import {
  Brain, History, BarChart3, Upload as UploadIcon,
  Github, BookOpen, Info
} from 'lucide-react';

import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryView from './components/HistoryView';
import Statistics from './components/Statistics';

import { appConfig } from './config/appConfig';

type Tab = 'upload' | 'history' | 'statistics';

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  disease_type: string;
  severity: string | null;
  is_normal: boolean;
  top_5_predictions: Array<{
    class: string;
    confidence: number;
  }>;
  heatmap: string | null;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const [showModelInfo, setShowModelInfo] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setRefreshSignal((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to process image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'upload' as Tab, label: 'Upload & Diagnose', icon: UploadIcon },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'statistics' as Tab, label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">

      {/* 🔥 NAVBAR */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-40 backdrop-blur-lg border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                AI Medical Diagnosis
              </h1>
              <p className="text-xs text-gray-300">
                Deep Learning Powered Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">

            {/* MODEL INFO */}
            <button
              onClick={() => setShowModelInfo(true)}
              title="View AI Model Details"
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* DOCS */}
            <a
              href={appConfig.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Documentation"
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
            >
              <BookOpen className="w-5 h-5" />
            </a>

            {/* GITHUB */}
            <a
              href={appConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View Source Code on GitHub"
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
            >
              <Github className="w-5 h-5" />
            </a>

          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* TABS */}
        <div className="flex space-x-2 mb-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-2 border border-white border-opacity-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="bg-white bg-opacity-95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">

          {activeTab === 'upload' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Medical Image
                </h2>
                <p className="text-gray-600">
                  Upload X-ray, retinal, skin, or MRI images for AI diagnosis
                </p>
              </div>

              <ImageUpload onUpload={handleUpload} isLoading={isLoading} />

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <ResultsDisplay result={result} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryView refreshSignal={refreshSignal} />
          )}

          {activeTab === 'statistics' && (
            <Statistics refreshSignal={refreshSignal} />
          )}

        </div>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-gray-400 text-sm border-t border-white border-opacity-10 pt-6">
          <p className="mb-2">
            Powered by EfficientNetB3 | Grad-CAM Visualization
          </p>
          <p>
            ⚠️ For research purposes only. Consult professionals for diagnosis.
          </p>
        </footer>

      </div>

      {/* 🔥 MODEL INFO MODAL */}
      {showModelInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">

            <button
              onClick={() => setShowModelInfo(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Model Information
            </h2>

            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {appConfig.modelInfo.name}</p>
              <p><strong>Version:</strong> {appConfig.modelInfo.version}</p>
              <p><strong>Accuracy:</strong> {appConfig.modelInfo.accuracy}</p>
              <p className="text-sm text-gray-600">
                {appConfig.modelInfo.description}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;