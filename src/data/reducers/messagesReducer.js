const messagesReducer = function(state = { all: {}, new: {} }, action) {
    // Get messages
    if (action.type === 'GET_MESSAGES') {
        return {
            all: action.all,
            new: action.new,
        };
    }
    return state;
};

export default messagesReducer;
