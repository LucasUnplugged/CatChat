const messagesReducer = (state = { all: {} }, action) => {
    // Get messages
    if (action.type === 'GET_MESSAGES') {
        return {
            all: action.all,
        };
    }
    return state;
};

export default messagesReducer;
