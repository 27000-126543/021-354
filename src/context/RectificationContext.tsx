import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Rectification } from '../types';
import { mockRectifications } from '../data/mockData';

interface RectificationState {
  rectifications: Rectification[];
}

type RectificationAction =
  | { type: 'ADD_RECTIFICATION'; payload: Rectification }
  | { type: 'UPDATE_RECTIFICATION'; payload: Rectification }
  | { type: 'SUBMIT_HANDLE'; payload: { id: string; handler: string; handleDescription: string } }
  | { type: 'REVIEW_PASS'; payload: { id: string; reviewer: string; reviewComment: string } }
  | { type: 'REVIEW_REJECT'; payload: { id: string; reviewer: string; reviewComment: string } };

const initialState: RectificationState = {
  rectifications: [...mockRectifications],
};

const rectificationReducer = (
  state: RectificationState,
  action: RectificationAction
): RectificationState => {
  switch (action.type) {
    case 'ADD_RECTIFICATION': {
      return {
        ...state,
        rectifications: [action.payload, ...state.rectifications],
      };
    }
    case 'UPDATE_RECTIFICATION': {
      return {
        ...state,
        rectifications: state.rectifications.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    }
    case 'SUBMIT_HANDLE': {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      return {
        ...state,
        rectifications: state.rectifications.map((r) =>
          r.id === action.payload.id
            ? {
                ...r,
                status: 'in_progress',
                handler: action.payload.handler,
                handleDescription: action.payload.handleDescription,
                handleDate: dateStr,
                updatedAt: now.toISOString().replace('T', ' ').split('.')[0],
              }
            : r
        ),
      };
    }
    case 'REVIEW_PASS': {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      return {
        ...state,
        rectifications: state.rectifications.map((r) =>
          r.id === action.payload.id
            ? {
                ...r,
                status: 'closed',
                reviewer: action.payload.reviewer,
                reviewComment: action.payload.reviewComment,
                reviewDate: dateStr,
                updatedAt: now.toISOString().replace('T', ' ').split('.')[0],
              }
            : r
        ),
      };
    }
    case 'REVIEW_REJECT': {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      return {
        ...state,
        rectifications: state.rectifications.map((r) =>
          r.id === action.payload.id
            ? {
                ...r,
                status: 'in_progress',
                reviewer: action.payload.reviewer,
                reviewComment: action.payload.reviewComment,
                reviewDate: dateStr,
                updatedAt: now.toISOString().replace('T', ' ').split('.')[0],
              }
            : r
        ),
      };
    }
    default:
      return state;
  }
};

interface RectificationContextType {
  state: RectificationState;
  dispatch: React.Dispatch<RectificationAction>;
  addRectification: (rectification: Omit<Rectification, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'handler' | 'handleDescription' | 'handleDate' | 'reviewer' | 'reviewComment' | 'reviewDate'>) => void;
  submitHandle: (id: string, handler: string, handleDescription: string) => void;
  reviewPass: (id: string, reviewer: string, reviewComment: string) => void;
  reviewReject: (id: string, reviewer: string, reviewComment: string) => void;
}

const RectificationContext = createContext<RectificationContextType | undefined>(undefined);

export const RectificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(rectificationReducer, initialState);

  const addRectification = (data: Omit<Rectification, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'handler' | 'handleDescription' | 'handleDate' | 'reviewer' | 'reviewComment' | 'reviewDate'>) => {
    const now = new Date();
    const newRectification: Rectification = {
      ...data,
      id: `rect-${Date.now()}`,
      status: 'pending',
      createdAt: now.toISOString().replace('T', ' ').split('.')[0],
      updatedAt: now.toISOString().replace('T', ' ').split('.')[0],
      handler: '',
      handleDescription: '',
      handleDate: '',
      reviewer: '',
      reviewComment: '',
      reviewDate: '',
    };
    dispatch({ type: 'ADD_RECTIFICATION', payload: newRectification });
  };

  const submitHandle = (id: string, handler: string, handleDescription: string) => {
    dispatch({ type: 'SUBMIT_HANDLE', payload: { id, handler, handleDescription } });
  };

  const reviewPass = (id: string, reviewer: string, reviewComment: string) => {
    dispatch({ type: 'REVIEW_PASS', payload: { id, reviewer, reviewComment } });
  };

  const reviewReject = (id: string, reviewer: string, reviewComment: string) => {
    dispatch({ type: 'REVIEW_REJECT', payload: { id, reviewer, reviewComment } });
  };

  return (
    <RectificationContext.Provider
      value={{
        state,
        dispatch,
        addRectification,
        submitHandle,
        reviewPass,
        reviewReject,
      }}
    >
      {children}
    </RectificationContext.Provider>
  );
};

export const useRectification = () => {
  const context = useContext(RectificationContext);
  if (context === undefined) {
    throw new Error('useRectification must be used within a RectificationProvider');
  }
  return context;
};
