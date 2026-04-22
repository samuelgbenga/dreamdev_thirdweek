import { createContext, useContext, useReducer } from 'react';

const VotingContext = createContext(null);

const initialState = {
  voterId: '',
  selectedCandidate: null,
  voteToken: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VOTER_ID':
      return { ...state, voterId: action.payload };
    case 'SET_CANDIDATE':
      return { ...state, selectedCandidate: action.payload };
    case 'SET_TOKEN':
      return { ...state, voteToken: action.payload };
    case 'CLEAR_SESSION':
      return initialState;
    default:
      return state;
  }
}

export function VotingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VotingContext.Provider value={{ state, dispatch }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  return useContext(VotingContext);
}
