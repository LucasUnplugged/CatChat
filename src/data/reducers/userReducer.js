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

    // Remove user
    else if (action.type === 'REMOVE_USER' && action.user && action.user.id) {
        // Remove user from state
        newState = update(state, { $unset: [action.user.id] });

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

    // Get users
    if (action.type === 'GET_USERS' && action.users) {
        return action.users;
    }

    return state;
};

export default userReducer;
