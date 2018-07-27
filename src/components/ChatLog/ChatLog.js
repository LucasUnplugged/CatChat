import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../data/actions';
import { getTime, isSameDay, format } from 'date-fns';
import * as api from '../../data/api';
import Notification from './Notification/Notification';
import './ChatLog.css';
import '../../shared/styles/grid.css';

class ChatLog extends Component {
    componentWillMount() {
        this.props.getMessages();
    }

    componentWillReceiveProps(newProps) {
        this.previousMessage = null;
    }

    componentDidUpdate() {
        // Scroll to the bottom of the chat log box
        this.refs.chatBox.scrollTop = this.refs.chatBox.scrollHeight;
    }

    getTime(timestamp) {
        if (!timestamp) {
            return '';
        }

        let sourceTime = getTime(timestamp);
        let today = getTime(new Date());
        let daysMatch = isSameDay(sourceTime, today);
        let timeText = '';

        if (daysMatch) {
            timeText = format(sourceTime, 'h:mm A');
        } else {
            timeText = '> 1 day ago';
        }
        return timeText;
    }

    getPrettyText(sourceText) {
        const { currentUser } = this.props;
        const isCurrentUserSet = currentUser && currentUser.name;
        const lowerCaseName = isCurrentUserSet ? currentUser.name.toLowerCase() : '';

        // Break up text into words
        let text = sourceText.split(' ');

        // "Prettify" @ mentions
        text = text.map(word => {
            const isAtMention = word.includes('@');
            const isAtCurrentUser = isCurrentUserSet && word.toLowerCase().includes(lowerCaseName);
            const atMentionClass = isAtCurrentUser ? 'at-mention-current' : 'at-mention-other';
            if (isAtMention) {
                return `<span class="${atMentionClass}">${word}</span>`;
            }
            return word;
        });

        return text.join(' ');
    }

    showMessageMeta(message) {
        // If we have a previous message, check if we
        // should display this message's meta data.
        if (this.previousMessage && message.user.name === this.previousMessage.user.name) {
            const elapsedTime = message.timestamp - this.previousMessage.timestamp;
            // If the time difference is less than 5 minutes, group them!
            if (elapsedTime < 300000) {
                return false;
            }
        }
        this.previousMessage = message;
        return true;
    }

    render() {
        const { messages, notifications, users } = this.props;
        const hasMessages = messages && Object.keys(messages).length > 0;
        const hasUsers = users && Object.keys(users).length > 0;

        // Find which users are typing
        let typingUsers = [];
        if (hasUsers) {
            for (const key in users) {
                if (users.hasOwnProperty(key)) {
                    const user = users[key];
                    if (user.typing) {
                        typingUsers.push(user);
                    }
                }
            }
        }

        // Describe which users are typing
        let typingUsersText = typingUsers.length > 0 ? typingUsers.map(user => user.name).join(', ') : null;
        if (typingUsers.length === 1) {
            typingUsersText += ' is typing...';
        } else if (typingUsers.length > 3) {
            typingUsersText = `${typingUsers.length} users are typing...`;
        } else if (typingUsers.length > 1) {
            typingUsersText = typingUsersText.replace(/, ([^, ]*)$/, ' and $1');
            typingUsersText += ' are typing...';
        }

        return (
            <section className="ChatLog">
                <ul className="notifications">
                    {notifications.map(notification => <Notification key={notification.id} message={notification} />)}
                </ul>
                <div className="chat-box" ref="chatBox">
                    <ul className="log">
                        {hasMessages &&
                            Object.keys(messages).map(id => {
                                const message = messages[id];
                                return (
                                    <li key={id}>
                                        {this.showMessageMeta(message) ? (
                                            <span className="meta">
                                                <span className="user">{message.user.name}</span>
                                                <span className="time">{this.getTime(message.timestamp)}</span>
                                            </span>
                                        ) : null}
                                        <span
                                            className="text"
                                            dangerouslySetInnerHTML={{ __html: this.getPrettyText(message.text) }}
                                        />
                                    </li>
                                );
                            })}
                    </ul>
                    {typingUsersText && <p className="typing-indicator">{typingUsersText}</p>}
                </div>
            </section>
        );
    }
}

ChatLog.propTypes = {
    messages: PropTypes.object,
    notifications: PropTypes.array,
    users: PropTypes.object,
};

const mapStateToProps = function(store) {
    // Get list of notifications specific to the current user
    const currentUser = api.users.getCurrentUser();
    let notifications = [];

    // If we have a current user, handle @ mentions
    if (currentUser && currentUser.name) {
        const currentAtMention = `@${currentUser.name.toLowerCase()}`;

        // Find messages directed at the current user
        for (const id in store.messages.new) {
            if (store.messages.new.hasOwnProperty(id)) {
                const message = store.messages.new[id];
                if (message.text.toLowerCase().includes(currentAtMention)) {
                    notifications.push(message);
                }
            }
        }
    }

    return {
        messages: store.messages.all,
        notifications,
        users: store.users,
        currentUser,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(ChatLog);
