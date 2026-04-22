import { createContext, useContext, useReducer } from 'react';

const ElectionContext = createContext(null);

const initialState = {
  elections: [],
  selectedElection: null,
  selectedState: '',
  selectedDate: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ELECTIONS':
      return { ...state, elections: action.payload };
    case 'SET_SELECTED_ELECTION':
      return { ...state, selectedElection: action.payload };
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function ElectionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ElectionContext.Provider value={{ state, dispatch }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(ElectionContext);
}
