import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const updatedAnecdote = action.payload;

      return state.map((a) =>
        a.id !== updatedAnecdote.id ? a : updatedAnecdote,
      );
    },

    createAnecdote(state, action) {
      state.push(action.payload);
    },

    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

const { setAnecdotes, createAnecdote, } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(createAnecdote(newAnecdote));
  };
};

export const voteAnecdoteAsync = (anecdote) => {
  return async (dispatch) => {
    const updated = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const returnedAnecdote = await anecdoteService.update(updated)

    dispatch(voteAnecdote(returnedAnecdote))
  }
}

export const { voteAnecdote } = anecdoteSlice.actions;

export default anecdoteSlice.reducer;
