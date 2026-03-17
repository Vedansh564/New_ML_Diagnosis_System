import { useEffect, useState } from 'react';
import { Clock, Activity, TrendingUp } from 'lucide-react';
import { Prediction } from '../lib/supabase';

interface HistoryViewProps {
  refreshSignal: number;
}

export default function HistoryView({ refreshSignal }: HistoryViewProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, [refreshSignal]);

  const fetchPredictions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/predictions`);

      if (!response.ok) {
        throw new Error(`Failed to fetch predictions: ${response.statusText}`);
      }

      const result = await response.json();
      setPredictions(result.predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No predictions yet</h3>
        <p className="text-gray-500">Upload an image to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction History</h2>

      <div className="grid gap-4">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {prediction.predicted_class.replace(/_/g, ' ')}
                  </h3>
                  {prediction.is_normal ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Normal
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      Abnormal
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>{prediction.disease_type}</span>
                  </div>
                  {prediction.severity && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Severity: {prediction.severity}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(prediction.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {(prediction.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Confidence</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
