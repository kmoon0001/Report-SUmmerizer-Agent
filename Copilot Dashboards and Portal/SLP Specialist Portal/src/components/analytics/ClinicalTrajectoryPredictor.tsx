import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ReferenceLine, Area, ComposedChart 
} from 'recharts';
import { 
  Calculator, TrendingUp, TrendingDown, Activity, AlertTriangle, 
  ShieldCheck, Sparkles, FileText, ArrowRight, Info
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { aiService } from '../../services/ai-service';
import { parseAIResponse } from '../../utils/json-parser';

// --- Statistical Models & Constants ---
const ASSESSMENTS = {
  MoCA: { name: 'MoCA', maxScore: 30, sem: 1.5, mdc: 4.1, defaultDeclinePerMonth: -0.3 },
  WAB_R: { name: 'WAB-R (AQ)', maxScore: 100, sem: 3.2, mdc: 8.9, defaultDeclinePerMonth: -1.5 },
  FIM_COG: { name: 'FIM Cognitive', maxScore: 35, sem: 1.2, mdc: 3.3, defaultDeclinePerMonth: -0.5 },
  CUSTOM: { name: 'Custom Scale', maxScore: 100, sem: 2.0, mdc: 5.5, defaultDeclinePerMonth: -1.0 }
};

type AssessmentType = keyof typeof ASSESSMENTS;

interface DataPoint {
  id: string;
  date: string;
  score: number;
}

export const ClinicalTrajectoryPredictor: React.FC = () => {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('MoCA');
  const [notesInput, setNotesInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [showLogic, setShowLogic] = useState(false);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: '1', date: '2023-09-01', score: 18 },
    { id: '2', date: '2023-10-01', score: 17 },
    { id: '3', date: '2023-11-01', score: 18 },
    { id: '4', date: '2023-12-01', score: 19 },
  ]);

  // --- Mathematical Engine ---
  const stats = useMemo(() => {
    if (dataPoints.length < 2) return null;

    const sorted = [...dataPoints].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstDate = new Date(sorted[0].date).getTime();
    
    // Convert dates to "months since start" for linear regression
    const points = sorted.map(p => ({
      x: (new Date(p.date).getTime() - firstDate) / (1000 * 60 * 60 * 24 * 30.44), // approx months
      y: p.score,
      date: p.date
    }));

    // Linear Regression (y = mx + b)
    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
    const intercept = (sumY - slope * sumX) / n || sorted[0].score;

    const assessment = ASSESSMENTS[assessmentType];
    const totalChange = sorted[sorted.length - 1].score - sorted[0].score;
    const isStatisticallySignificant = Math.abs(totalChange) >= assessment.mdc;

    // Maintenance Validation: Is the slope better than the expected natural decline?
    const maintenanceValidated = slope > assessment.defaultDeclinePerMonth;
    
    // Restorative Potential: Is the slope positive and approaching MDC?
    const restorativePotential = slope > 0.5 ? 'High' : (slope > -0.2 ? 'Moderate' : 'Low');

    // Generate Chart Data (Historical + Projected)
    const lastPoint = points[points.length - 1];
    const chartData = points.map(p => ({
      date: p.date,
      Actual: p.y,
      Trend: Number((slope * p.x + intercept).toFixed(1)),
      ExpectedDecline: null as number | null
    }));

    // Add a 3-month projection
    for (let i = 1; i <= 3; i++) {
      const projX = lastPoint.x + i;
      const projDate = new Date(firstDate + projX * (1000 * 60 * 60 * 24 * 30.44));
      
      chartData.push({
        date: projDate.toISOString().split('T')[0],
        Actual: null as any,
        Trend: Number((slope * projX + intercept).toFixed(1)),
        ExpectedDecline: Number((lastPoint.y + (assessment.defaultDeclinePerMonth * i)).toFixed(1))
      });
    }

    return {
      slope,
      intercept,
      totalChange,
      isStatisticallySignificant,
      maintenanceValidated,
      restorativePotential,
      chartData,
      assessment
    };
  }, [dataPoints, assessmentType]);

  const handleExtractScores = async () => {
    if (!notesInput.trim()) return;
    setIsExtracting(true);
    
    try {
      const prompt = `
        Extract assessment scores and dates from the following clinical notes.
        Look for ${ASSESSMENTS[assessmentType].name} scores.
        Return ONLY a JSON array of objects with "date" (YYYY-MM-DD) and "score" (number).
        If no exact dates are found, estimate based on the text (e.g., "Initial eval 3 months ago").
        
        Notes:
        """${notesInput}"""
      `;

      const response = await aiService.generateContent(prompt, {
        systemInstruction: "You are a clinical data extractor. Output strictly valid JSON array.",
        temperature: 0.1
      });

      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = parseAIResponse(cleaned, []);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        const newPoints = parsed.map((p: any, i: number) => ({
          id: Date.now().toString() + i,
          date: p.date,
          score: Number(p.score)
        }));
        setDataPoints(newPoints);
      }
    } catch (error) {
      console.error("Failed to extract scores:", error);
      // Fallback or error handling could go here
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Subtle Experimental Badge */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Trajectory & Maintenance Validator</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/80 border border-indigo-100/50 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>Experimental Analytics</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl">
            Uses linear regression, Standard Error of Measurement (SEM), and Minimal Detectable Change (MDC) to statistically validate skilled maintenance therapy and predict restorative potential.
          </p>
        </div>
        <button
          onClick={() => setShowLogic(!showLogic)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
        >
          <Info className="w-4 h-4" />
          How does this work?
        </button>
      </div>

      {showLogic && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-6"
        >
          <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Predictive Analytics Logic & Formulas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-indigo-800">
            <div>
              <h4 className="font-bold mb-2">1. Linear Regression (Trend Line)</h4>
              <p className="mb-2">We use the least squares method to find the line of best fit through the patient's historical scores. This calculates the <strong>Slope (m)</strong>, representing the average change in score per month.</p>
              <code className="block bg-white/60 p-2 rounded text-xs font-mono border border-indigo-200">
                m = [NΣ(xy) - ΣxΣy] / [NΣ(x²) - (Σx)²]
              </code>
            </div>
            <div>
              <h4 className="font-bold mb-2">2. Maintenance Validation</h4>
              <p className="mb-2">We compare the patient's calculated slope against the <strong>Expected Natural Decline</strong> for the specific assessment. If the slope is greater (less negative) than the natural decline, it suggests skilled therapy is effectively maintaining function.</p>
              <code className="block bg-white/60 p-2 rounded text-xs font-mono border border-indigo-200">
                IsValid = Slope &gt; ExpectedDeclineRate
              </code>
            </div>
            <div>
              <h4 className="font-bold mb-2">3. Minimal Detectable Change (MDC)</h4>
              <p className="mb-2">MDC represents the smallest change in score that is statistically significant (not due to measurement error). We use this to determine if the patient has true <strong>Restorative Potential</strong>.</p>
              <code className="block bg-white/60 p-2 rounded text-xs font-mono border border-indigo-200">
                IsSignificant = |TotalChange| &ge; MDC
              </code>
            </div>
            <div>
              <h4 className="font-bold mb-2">4. Projections</h4>
              <p className="mb-2">We project the trend line 3 months into the future to forecast potential outcomes, helping guide discharge planning and goal setting.</p>
              <code className="block bg-white/60 p-2 rounded text-xs font-mono border border-indigo-200">
                ProjectedScore = Slope * FutureMonth + Intercept
              </code>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input & Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Data Ingestion
              </h3>
              <select 
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
                className="text-sm border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-indigo-500"
              >
                {Object.entries(ASSESSMENTS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Paste Clinical Notes
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Paste progress notes, flowsheets, or evaluations to automatically extract scores..."
                  className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
                <button
                  onClick={handleExtractScores}
                  disabled={isExtracting || !notesInput.trim()}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {isExtracting ? 'Extracting Data...' : 'Extract Scores via AI'}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Extracted Data Points
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {dataPoints.map((dp, idx) => (
                    <div key={dp.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm border border-slate-100">
                      <span className="text-slate-500 font-mono">{dp.date}</span>
                      <span className="font-bold text-slate-700">{dp.score} pts</span>
                    </div>
                  ))}
                  {dataPoints.length === 0 && (
                    <div className="text-center py-4 text-sm text-slate-400 italic">No data points yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistical Parameters Card */}
          {stats && (
            <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5">
              <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Statistical Parameters ({stats.assessment.name})
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Standard Error (SEM)</span>
                  <span className="font-mono font-medium text-slate-900">±{stats.assessment.sem}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Min. Detectable Change (MDC)</span>
                  <span className="font-mono font-medium text-slate-900">{stats.assessment.mdc} pts</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Expected Natural Decline</span>
                  <span className="font-mono font-medium text-red-600">{stats.assessment.defaultDeclinePerMonth} pts/mo</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visualization & Insights */}
        <div className="lg:col-span-2 space-y-6">
          {stats ? (
            <>
              {/* Top Insight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Maintenance Validation */}
                <div className={`p-5 rounded-2xl border ${stats.maintenanceValidated ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {stats.maintenanceValidated ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      )}
                      <h3 className={`font-bold ${stats.maintenanceValidated ? 'text-emerald-900' : 'text-rose-900'}`}>
                        Maintenance Therapy
                      </h3>
                    </div>
                  </div>
                  <div className={`text-2xl font-black mb-1 ${stats.maintenanceValidated ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {stats.maintenanceValidated ? 'Validated' : 'At Risk'}
                  </div>
                  <p className={`text-sm ${stats.maintenanceValidated ? 'text-emerald-700/80' : 'text-rose-700/80'}`}>
                    Trajectory ({stats.slope > 0 ? '+' : ''}{stats.slope.toFixed(2)} pts/mo) outperforms expected natural decline ({stats.assessment.defaultDeclinePerMonth} pts/mo).
                  </p>
                </div>

                {/* Restorative Potential */}
                <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Restorative Potential</h3>
                  </div>
                  <div className="text-2xl font-black mb-1 text-blue-700">
                    {stats.restorativePotential}
                  </div>
                  <p className="text-sm text-slate-500">
                    {stats.isStatisticallySignificant 
                      ? `Total change (${stats.totalChange > 0 ? '+' : ''}${stats.totalChange}) exceeds MDC (${stats.assessment.mdc}), proving true clinical improvement.`
                      : `Change is within measurement error (MDC: ${stats.assessment.mdc}). Focus on maintenance.`}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Clinical Trajectory & Projection</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      
                      {/* Expected Decline (Without Therapy) */}
                      <Line 
                        type="monotone" 
                        dataKey="ExpectedDecline" 
                        name="Expected Natural Decline" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={false}
                      />
                      
                      {/* Actual Therapy Trend */}
                      <Line 
                        type="monotone" 
                        dataKey="Trend" 
                        name="Therapy Trajectory" 
                        stroke="#6366f1" 
                        strokeWidth={2} 
                        strokeDasharray="3 3" 
                        dot={false}
                      />
                      
                      {/* Actual Data Points */}
                      <Line 
                        type="monotone" 
                        dataKey="Actual" 
                        name="Actual Score" 
                        stroke="#0f172a" 
                        strokeWidth={3} 
                        dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} 
                        activeDot={{ r: 7 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              <Activity className="w-12 h-12 text-slate-300 mb-4" />
              <p>Add at least two data points to generate trajectory analytics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};