import update from 'immutability-helper';

const userReducer = (state = {}, action) => {
    let newState = {};

    // Add user
    if (action.type === 'ADD_USER' && action.user && action.user.id) {
        // Set the user in the state
        let userObject = {};
        userObject[action.user.id] = action.user;
        newState = update(state, { $merge: userObject });
        return newState;
    }

    // User chat input
    else if (action.type === 'USER_CHAT_INPUT' && action.user && action.user.id) {
        // Update user
        let userObject = {};
        userObject[action.user.id] = action.user;
        newState = update(state, { $merge: userObject });

        return newState;
    }

    return state;
};

export default userReducer;
