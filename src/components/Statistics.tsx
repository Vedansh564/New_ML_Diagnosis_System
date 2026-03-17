import { useEffect, useState } from 'react';
import { BarChart3, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface Stats {
  total_predictions: number;
  normal_count: number;
  abnormal_count: number;
  average_confidence: number;
  disease_distribution: Record<string, number>;
}

interface StatisticsProps {
  refreshSignal: number;
}

export default function Statistics({ refreshSignal }: StatisticsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshSignal]);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/stats`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();

      setStats({
        total_predictions: data.total_predictions || 0,
        normal_count: data.normal_count || 0,
        abnormal_count: data.abnormal_count || 0,
        average_confidence: data.average_confidence || 0,
        disease_distribution: data.disease_distribution || {},
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }

  if (!stats || stats.total_predictions === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No data yet</h3>
        <p className="text-gray-500">Statistics will appear after predictions are made</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Predictions</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.total_predictions}
              </p>
            </div>
            <Activity className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Normal Cases</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.normal_count}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Abnormal Cases</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.abnormal_count}
              </p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Confidence</p>
              <p className="text-3xl font-bold text-blue-600">
                {(stats.average_confidence * 100).toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Disease Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.disease_distribution)
            .sort(([, a], [, b]) => b - a)
            .map(([disease, count]) => {
              const percentage = (count / stats.total_predictions) * 100;
              return (
                <div key={disease}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {disease.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
