import { CheckCircle, AlertTriangle, Activity, TrendingUp } from 'lucide-react';

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

interface ResultsDisplayProps {
  result: PredictionResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const confidencePercentage = (result.confidence * 100).toFixed(2);
  const isHighConfidence = result.confidence >= 0.8;

  const getStatusColor = () => {
    if (result.is_normal) return 'text-green-600';
    if (result.severity) return 'text-red-600';
    return 'text-orange-600';
  };

  const getStatusBg = () => {
    if (result.is_normal) return 'bg-green-50 border-green-200';
    if (result.severity) return 'bg-red-50 border-red-200';
    return 'bg-orange-50 border-orange-200';
  };

  const getStatusIcon = () => {
    if (result.is_normal) return <CheckCircle className="h-8 w-8" />;
    return <AlertTriangle className="h-8 w-8" />;
  };

  return (
    <div className="space-y-6">
      <div className={`border-2 rounded-lg p-6 ${getStatusBg()}`}>
        <div className="flex items-start space-x-4">
          <div className={getStatusColor()}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {result.predicted_class.replace(/_/g, ' ')}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Type: <span className="font-medium">{result.disease_type}</span>
                </span>
              </div>
              {result.severity && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Severity: <span className="font-medium">{result.severity}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Confidence Score
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {confidencePercentage}%
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isHighConfidence
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {isHighConfidence ? 'High' : 'Moderate'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  isHighConfidence ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Top Predictions
          </h4>
          <div className="space-y-2">
            {result.top_5_predictions.slice(0, 3).map((pred, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {pred.class.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {(pred.confidence * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.heatmap && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Grad-CAM Visualization
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            The heatmap highlights the regions that influenced the diagnosis decision.
            Red areas indicate high importance.
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img
              src={`data:image/png;base64,${result.heatmap}`}
              alt="Grad-CAM Heatmap"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <p className="text-sm text-blue-800">
          <strong>Disclaimer:</strong> This is an AI-assisted diagnosis tool for educational
          and research purposes only. Always consult with qualified healthcare professionals
          for medical advice and treatment decisions.
        </p>
      </div>
    </div>
  );
}
