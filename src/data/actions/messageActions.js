import update from 'immutability-helper';
import { getTime } from 'date-fns';
import { users, messages } from '../api';

export const addMessage = sourceMessage => async dispatch => {
    // Prepare new message
    let messageEntry = messages.push();
    let now = getTime(new Date());
    let newMessage = {
        id: messageEntry.key,
        user: sourceMessage.user,
        timestamp: now,
        text: sourceMessage.text,
        isRead: false,
    };

    // Push the new message to the database
    messageEntry.set(newMessage);

    // Update the user as no longer typing and with blank text
    users
        .child(sourceMessage.user.id)
        .once('value')
        .then(userEntry => {
            let user = update(userEntry.val(), {
                $merge: {
                    text: '',
                    typing: false,
                },
            });

            // Push the new user to the database
            let userObject = {};
            userObject[user.id] = user;
            users.update(userObject);

            // Save as the current user
            users.setCurrentUser(user);

            // Dispatch the user action
            dispatch({
                type: 'USER_CHAT_INPUT',
                user: user,
            });
        });
};

export const getMessages = () => async dispatch => {
    let allMessages;

    // Get all messages
    messages.on('value', dataSnapshot => {
        allMessages = dataSnapshot.val();
        _dispatchMessages();
    });

    // Dispatch the action with the messages
    const _dispatchMessages = () => {
        dispatch({
            type: 'GET_MESSAGES',
            all: allMessages,
        });
    };
};
