export default (state, action) => {
    switch (action.type) {
        case "addConnection" :
            return {...state, activeConnections: state.activeConnections + 1};
        case "removeConnection" :
            return {...state, activeConnections: Math.max(state.activeConnections - 1, 0)};
        case "clearConnections" :
            return {...state, activeConnections: 0};
        default:
            return state;
    }
};
