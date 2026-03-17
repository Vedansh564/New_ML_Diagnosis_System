import { useState } from 'react';
import { Brain, History, BarChart3, Upload as UploadIcon } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryView from './components/HistoryView';
import Statistics from './components/Statistics';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Medical Diagnosis System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Advanced deep learning for medical image analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 mb-8 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {activeTab === 'upload' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Medical Image
                </h2>
                <p className="text-gray-600">
                  Upload a chest X-ray, retinal image, skin lesion photo, or brain MRI
                  for automated diagnosis
                </p>
              </div>

              <ImageUpload onUpload={handleUpload} isLoading={isLoading} />

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              {result && <ResultsDisplay result={result} />}
            </div>
          )}

          {activeTab === 'history' && <HistoryView />}

          {activeTab === 'statistics' && <Statistics />}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>
            Powered by EfficientNetB3 with Transfer Learning | Grad-CAM Visualization
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
