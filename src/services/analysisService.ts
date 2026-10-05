import { apiClient, parseAxiosError, ApiError, API_BASE_URL } from './api';
import { AnalysisRequest, AnalysisResponse, RecentAnalysisRecord, HistoricalDataPoint } from '../types/analysis';
import { DEFAULT_ANALYSIS_RESULT, RECENT_ANALYSES_DATA, HISTORICAL_CHRONO_DATA, LOCATION_PRESETS, MUMBAI_SAMPLE_GEOJSON, BENGALURU_SAMPLE_GEOJSON } from '../data/demoData';

export class AnalysisService {
  /**
   * Submit change detection analysis job
   */
  static async submitAnalysis(request: AnalysisRequest): Promise<{ data: AnalysisResponse | null; error: ApiError | null }> {
    try {
      const response = await apiClient.post<AnalysisResponse>('/analysis', {
        location: request.location,
        before_year: request.before_year,
        after_year: request.after_year,
        dataset: request.dataset,
        area_of_interest: request.area_of_interest || null,
        confidence_threshold: request.confidence_threshold ?? 0.85,
      });

      return { data: { ...response.data, is_demo: false }, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err, '/analysis') };
    }
  }

  /**
   * Check status of asynchronous analysis job
   */
  static async getAnalysisStatus(analysisId: string): Promise<{ status: string; progress?: number; error: ApiError | null }> {
    try {
      const response = await apiClient.get<{ status: string; progress?: number }>(`/analysis/${analysisId}/status`);
      return { status: response.data.status, progress: response.data.progress, error: null };
    } catch (err) {
      return { status: 'failed', error: parseAxiosError(err, `/analysis/${analysisId}/status`) };
    }
  }

  /**
   * Get completed analysis results by ID
   */
  static async getAnalysisResult(analysisId: string): Promise<{ data: AnalysisResponse | null; error: ApiError | null }> {
    try {
      const response = await apiClient.get<AnalysisResponse>(`/analysis/${analysisId}`);
      return { data: { ...response.data, is_demo: false }, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err, `/analysis/${analysisId}`) };
    }
  }

  /**
   * Fetch list of previous analyses
   */
  static async getRecentAnalyses(): Promise<{ data: RecentAnalysisRecord[]; error: ApiError | null }> {
    try {
      const response = await apiClient.get<RecentAnalysisRecord[]>('/analyses');
      return { data: response.data, error: null };
    } catch (err) {
      return { data: [], error: parseAxiosError(err, '/analyses') };
    }
  }

  /**
   * Fetch historical multi-year statistics
   */
  static async getHistoricalStatistics(location: string): Promise<{ data: HistoricalDataPoint[]; error: ApiError | null }> {
    try {
      const response = await apiClient.get<HistoricalDataPoint[]>('/statistics/historical', {
        params: { location },
      });
      return { data: response.data, error: null };
    } catch (err) {
      return { data: [], error: parseAxiosError(err, '/statistics/historical') };
    }
  }

  /**
   * Check backend connection health
   */
  static async checkBackendHealth(): Promise<{ online: boolean; latencyMs: number; message: string }> {
    const startTime = performance.now();
    try {
      await apiClient.get('/health', { timeout: 3000 });
      const latencyMs = Math.round(performance.now() - startTime);
      return { online: true, latencyMs, message: `Connected to ${API_BASE_URL} (${latencyMs}ms)` };
    } catch (err) {
      return { online: false, latencyMs: 0, message: `Offline: Cannot reach ${API_BASE_URL}` };
    }
  }

  /**
   * Fallback generator for demo simulation when explicitly chosen by user
   */
  static getSimulatedAnalysis(request: AnalysisRequest): AnalysisResponse {
    const loc = LOCATION_PRESETS.find(p => p.name.toLowerCase().includes(request.location.toLowerCase())) || LOCATION_PRESETS[0];
    const geojson = loc.id === 'bengaluru' ? BENGALURU_SAMPLE_GEOJSON : MUMBAI_SAMPLE_GEOJSON;
    const yearDiff = Math.max(1, request.after_year - request.before_year);
    const scaledArea = Number((loc.historicalChangeSummary.totalAreaKm2 * (yearDiff / 10)).toFixed(1));
    const urbanChange = Number((loc.historicalChangeSummary.urbanGrowthPct * (yearDiff / 10)).toFixed(1));
    const vegLoss = Number((loc.historicalChangeSummary.vegetationLossKm2 * (yearDiff / 10)).toFixed(1));

    return {
      analysis_id: `DEMO-${loc.id.toUpperCase()}-${request.before_year}-${request.after_year}`,
      status: 'completed',
      location: loc.name,
      before_year: request.before_year,
      after_year: request.after_year,
      dataset: request.dataset,
      changed_area_km2: scaledArea,
      urban_change_percent: urbanChange,
      vegetation_loss_km2: vegLoss,
      confidence: 0.926,
      processed_at: new Date().toISOString(),
      geojson,
      categories: [
        {
          category: 'urban_expansion',
          label: 'Urban Expansion (Built-up)',
          areaKm2: Number((scaledArea * 0.58).toFixed(1)),
          percentage: 58.0,
          color: '#16A765',
        },
        {
          category: 'vegetation_loss',
          label: 'Vegetation Loss / Clearing',
          areaKm2: Number((scaledArea * 0.28).toFixed(1)),
          percentage: 28.0,
          color: '#E45B5B',
        },
        {
          category: 'water_transition',
          label: 'Water / Shoreline Shift',
          areaKm2: Number((scaledArea * 0.14).toFixed(1)),
          percentage: 14.0,
          color: '#5B9DE8',
        },
      ],
      is_demo: true,
    };
  }
}
