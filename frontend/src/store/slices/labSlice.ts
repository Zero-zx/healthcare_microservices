import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testDate: string;
  result: string;
  status: 'pending' | 'completed';
  notes: string;
}

interface LabState {
  results: LabResult[];
  loading: boolean;
  error: string | null;
}

const initialState: LabState = {
  results: [],
  loading: false,
  error: null,
};

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<LabResult[]>) => {
      state.results = action.payload;
    },
    addResult: (state, action: PayloadAction<LabResult>) => {
      state.results.push(action.payload);
    },
    updateResult: (state, action: PayloadAction<LabResult>) => {
      const index = state.results.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.results[index] = action.payload;
      }
    },
    deleteResult: (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setResults,
  addResult,
  updateResult,
  deleteResult,
  setLoading,
  setError,
} = labSlice.actions;

export default labSlice.reducer; 