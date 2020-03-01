const { default: createSlice, ucfl } = require('../index');

describe('ucfl', () => {
  it('should capitalize first letter', () => {
    expect(ucfl('a')).toEqual('A');
    expect(ucfl('bobsBurgers')).toEqual('BobsBurgers');
    expect(ucfl('iPhone')).toEqual('IPhone');
    expect(ucfl('John')).toEqual('John');
    expect(ucfl('FBI')).toEqual('FBI');
  });

  it('should return empty string', () => {
    expect(ucfl('')).toEqual('');
    expect(ucfl(null)).toEqual('');
    expect(ucfl()).toEqual('');
    expect(ucfl(123)).toEqual('');
    expect(ucfl([])).toEqual('');
    expect(ucfl({})).toEqual('');
  });

  it('should do nothing for special characters', () => {
    expect(ucfl('!bob')).toEqual('!bob');
    expect(ucfl('@bob')).toEqual('@bob');
    expect(ucfl('#bob')).toEqual('#bob');
    expect(ucfl('$bob')).toEqual('$bob');
    expect(ucfl('%bob')).toEqual('%bob');
    expect(ucfl('^bob')).toEqual('^bob');
    expect(ucfl('&bob')).toEqual('&bob');
    expect(ucfl('*bob')).toEqual('*bob');
    expect(ucfl('(bob')).toEqual('(bob');
    expect(ucfl(')bob')).toEqual(')bob');
  });
});

describe('createSlice', () => {
  describe('named slice', () => {
    const name = 'sliceName';
    const initialState = {
      prop: 'prop',
      field: 'field',
      awesomeProp: 'awesomeProp',
      awesomeField: 'awesomeField',
      overwriteSetter: 'field',
    };
    const reducers = {
      doAwesome: (state, action) => {
        state.awesomeProp = true;
        state.awesomeField = true;
      },
      setOverwriteSetter: (state, action) => {
      	state.overwriteSetter = `custom - ${action.payload}`;
      },
    };

    const sliceData = createSlice({
      name,
      initialState,
      reducers,
    });
    const {
      reducer,
      actions,
      selectors,
    } = sliceData;

    describe('actionObject', () => {
      it('should have all setters and reducer functions', () => {
        expect(Object.keys(actions).length).toBe(6);
        const {
          setProp,
          setField,
          setAwesomeProp,
          setAwesomeField,
          doAwesome,
        } = actions;
        expect(typeof setProp).toEqual('function');
        expect(typeof setField).toEqual('function');
        expect(typeof setAwesomeProp).toEqual('function');
        expect(typeof setAwesomeField).toEqual('function');
        expect(typeof doAwesome).toEqual('function');
      });
    })

    describe('reducer w/ actions', () => {
      let state;
      beforeEach(() => {
        state = reducer(undefined, { type: "@@INIT" });
      });

      const testActionInReducer = (name) => {
        const actionName = `set${ucfl(name)}`;
        const actionCreator = actions[actionName];
        expect(actionCreator).not.toBeNull();

        const expected = 'newValue';
        const action = actionCreator(expected);
        expect(action).toEqual({
          type: actionCreator.type,
          payload: expected,
        });

        expect(state[name]).toBe(name);
        state = sliceData.reducer(state, action);
        expect(state[name]).toBe(expected);
      };

      it('should properly setProp', () => {
        testActionInReducer('prop');
      });

      it('should properly setField', () => {
        testActionInReducer('field');
      });

      it('should properly setAwesomeProp', () => {
        testActionInReducer('awesomeProp');
      });

      it('should properly setAwesomeField', () => {
        testActionInReducer('awesomeField');
      });

	  it('should not overwrite custom written setter actions', () => {
	  	const payload = 'Payload';
	  	const action = actions.setOverwriteSetter(payload);

	  	expect(action).toEqual({
	  	  type: actions.setOverwriteSetter.type,
	  	  payload,
		});

		expect(state.overwriteSetter).toBe('field');
		state = sliceData.reducer(state, action);
		expect(state.overwriteSetter).toBe(`custom - ${payload}`);
	  });

      it('should properly doAwesome', () => {
        const action = actions.doAwesome();
        expect(action).toEqual({
          type: actions.doAwesome.type,
        });

        expect(state.awesomeProp).toBe('awesomeProp');
        expect(state.awesomeField).toBe('awesomeField');
        state = sliceData.reducer(state, action);
        expect(state.awesomeProp).toBe(true);
        expect(state.awesomeField).toBe(true);
      });

      it('should return initial state for unknown actions', () => {
        const newState = sliceData.reducer(state, { type: 'UNKNOWN' });
        expect(newState).toBe(state);
      });
    });

    describe('selectors', () => {
      const {
        getSliceName,
        selectProp,
        selectField,
        selectAwesomeProp,
        selectAwesomeField,
	  	selectOverwriteSetter,
      } = selectors;

      const immuState = reducer(undefined, { type: "@@INIT" });
      const selectorState = {
        [name]: immuState,
      };

      it('should have all selectors set up properly', () => {
        expect(Object.keys(selectors).length).toBe(6);
        expect(typeof getSliceName).toEqual('function');
        expect(typeof selectProp).toEqual('function');
        expect(typeof selectField).toEqual('function');
        expect(typeof selectAwesomeProp).toEqual('function');
        expect(typeof selectAwesomeField).toEqual('function');
        expect(typeof selectOverwriteSetter).toEqual('function');
      });

      it('should getSliceName', () => {
        expect(getSliceName(selectorState)).toEqual(immuState);
      });

      it('should getSliceName as empty object if slice missing', () => {
        expect(getSliceName({})).toEqual({});
      });

      it('should selectProp', () => {
        expect(selectProp(selectorState)).toEqual('prop');
      });

      it('should selectProp as undefined if slice missing', () => {
        expect(selectProp({})).toBeUndefined();
      });

      it('should selectField', () => {
        expect(selectField(selectorState)).toEqual('field');
      });

      it('should selectField as undefined if slice missing', () => {
        expect(selectField({})).toBeUndefined();
      });

      it('should selectAwesomeProp', () => {
        expect(selectAwesomeProp(selectorState)).toEqual('awesomeProp');
      });

      it('should selectAwesomeProp as undefined if slice missing', () => {
        expect(selectAwesomeProp({})).toBeUndefined();
      });

      it('should selectAwesomeField', () => {
        expect(selectAwesomeField(selectorState)).toEqual('awesomeField');
      });

      it('should selectAwesomeField as undefined if slice missing', () => {
        expect(selectAwesomeField({})).toBeUndefined();
      });
    });
  });
});
