export const STATE = {
  MENU: 'MENU',
  EXPLORE: 'EXPLORE',
  DIALOG: 'DIALOG',
  CHALLENGE: 'CHALLENGE',
  CERTIFICATE: 'CERTIFICATE'
};

export class StateManager {
  constructor() {
    this._currentState = STATE.MENU;
    this._previousState = null;
    this._stateData = {};
  }

  setState(newState, data = {}) {
    this._previousState = this._currentState;
    this._currentState = newState;
    this._stateData = data;
  }

  getState() {
    return this._currentState;
  }

  getPreviousState() {
    return this._previousState;
  }

  getData() {
    return this._stateData;
  }

  is(state) {
    return this._currentState === state;
  }

  was(state) {
    return this._previousState === state;
  }

  goBack() {
    if (this._previousState) {
      this._currentState = this._previousState;
      this._previousState = null;
    }
  }
}
