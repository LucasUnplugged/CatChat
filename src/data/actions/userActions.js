import appConfig from '../../shared/appConfig';
import { users } from '../api';

export const addUser = sourceUser => async dispatch => {
    // Prepare new user
    let userEntry = users.push();
    let newUser = {
        id: userEntry.key,
        name: sourceUser.name,
        window: appConfig.id,
        typing: false,
        text: '',
    };

    // Push the new user to the database
    userEntry.set(newUser);

    // Save as the current user
    users.setCurrentUser(newUser);

    // Dispatch the user action
    dispatch({
        type: 'ADD_USER',
        user: newUser,
    });
};

export const removeUser = sourceUser => async dispatch => {
    if (!sourceUser || !sourceUser.id) {
        return;
    }
    users.child(sourceUser.id).remove();

    // Reset the current user
    users.setCurrentUser(null);

    // Dispatch the user action
    dispatch({
        type: 'REMOVE_USER',
        user: sourceUser,
    });
};

export const userChatInput = sourceUser => async dispatch => {
    // Update the user in the database
    let userObject = {};
    userObject[sourceUser.id] = sourceUser;
    users.update(userObject);

    // Save as the current user
    users.setCurrentUser(sourceUser);

    // Dispatch the user action
    dispatch({
        type: 'USER_CHAT_INPUT',
        user: sourceUser,
    });
};

export const atMention = actionData => async dispatch => {
    const currentUser = users.getCurrentUser();

    // Only proceed if we have the data we need
    if (!actionData.user || !currentUser) {
        return;
    }

    // Push the new user to the database
    let userObject = {};
    userObject[currentUser.id] = currentUser;
    userObject[currentUser.id].text = `@${actionData.user.name} ${currentUser.text}`;
    userObject[currentUser.id].typing = true;
    users.update(userObject);

    // Save as the current user
    users.setCurrentUser(userObject[currentUser.id]);

    // Dispatch the user action
    dispatch({
        type: 'USER_CHAT_INPUT',
        user: userObject[currentUser.id],
    });
};

export const getUsers = () => async dispatch => {
    users.on('value', dataSnapshot => {
        const userEntries = dataSnapshot.val();

        // Set the current user
        if (!users.getCurrentUser()) {
            for (const key in userEntries) {
                if (userEntries.hasOwnProperty(key)) {
                    const user = userEntries[key];
                    if (user.window === appConfig.id) {
                        // Save as the current user
                        users.setCurrentUser(user);
                        break;
                    }
                }
            }
        }

        dispatch({
            type: 'GET_USERS',
            users: userEntries,
        });
    });
};
