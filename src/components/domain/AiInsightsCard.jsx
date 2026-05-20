import { Sparkles, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import './AiInsightsCard.css';

export default function AiInsightsCard({ summary, recommendation, riskFlag, onAction, actionLabel }) {
  const recommendations = recommendation
    ? recommendation.split('. ').filter(Boolean).map(r => r.trim().replace(/\.$/, ''))
    : [];

  return (
    <div className="ai-card">
      <div className="ai-card__header">
        <div className="ai-card__header-icon">
          <Sparkles size={20} />
        </div>
        <h3 className="ai-card__title">AI Insights & Summary</h3>
      </div>

      <div className="ai-card__body">
        {/* Analysis Section */}
        <div className="ai-card__section">
          <div className="ai-card__section-label">
            <BarChart3 size={14} />
            <span>Analysis</span>
          </div>
          <blockquote className="ai-card__analysis">
            {summary || 'No analysis available yet.'}
          </blockquote>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="ai-card__section">
            <div className="ai-card__section-label ai-card__section-label--green">
              <CheckCircle2 size={14} />
              <span>Recommendations</span>
            </div>
            <ul className="ai-card__recommendations">
              {recommendations.map((rec, i) => (
                <li key={i} className="ai-card__recommendation-item">
                  <CheckCircle2 size={14} className="ai-card__check-icon" />
                  <span>{rec}.</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested Next Step */}
        {onAction && actionLabel && (
          <div className="ai-card__action">
            <p className="ai-card__action-label">Suggested Next Step</p>
            <Button
              variant="primary"
              icon={ShieldCheck}
              onClick={onAction}
              className="ai-card__action-btn"
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
