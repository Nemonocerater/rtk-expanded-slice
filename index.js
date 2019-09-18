const { createSlice } = require('redux-starter-kit');

const ucfl = (s) => (s && typeof s === 'string') ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const createSetters = (initialState) => {
	const setters = {};
	for (let data in initialState) {
		const name = `set${ucfl(data)}`;
		setters[name] = (state, action) => { state[data] = action.payload };
	}
	return setters;
};

const createSelectors = (slice, initialState) => {
	let selectors = {};

	const getSliceName = (state) => (state && state[slice]) ? state[slice] : {};
	if (slice) {
		selectors = { getSliceName };
	}

	for (let data in initialState) {
		const name = `select${ucfl(data)}`;
		if (slice) {
			selectors[name] = (state) => getSliceName(state)[data];
		} else {
			selectors[name] = (state) => state[data];
		}
	}

	return selectors;
};

const createCustomSlice = (config) => {
	config.reducers = config.reducers || {};

	// Add setters to the reducer from initial state values
	const setters = createSetters(config.initialState);
	config.reducers = { ...config.reducers, ...setters };

	const slice = createSlice(config);

	// Generate selectors for initial state values
	slice.selectors = createSelectors(config.slice, config.initialState);

	return slice;
};

module.exports = {
	default: createCustomSlice,
	ucfl
};

// Need this to make the default export importable using `import x from '<this-package>'`
Object.defineProperty(module.exports, '__esModule', { value: true });
