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
