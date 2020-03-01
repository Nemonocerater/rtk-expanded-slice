
# Redux Toolkit Expanded Slice

This project takes the createSlice function in Redux Toolkit and uses the initial state
to generate selectors and setters (action) functions for every field in the state.
The vast majority of boilerplate written in Redux seems to be setters and getters for
fields in Redux where you just store it and read it without much business logic.

## Using the expanded create slice function

The function works just as described in redux toolkit except it creates the additional
selectors and setter actions.

See [redux toolkit api](https://redux-toolkit.js.org/api/createSlice)