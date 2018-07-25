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
        const currentUser = api.users.getCurrentUser();

        // Break up text into words
        let text = sourceText.split(' ');

        // "Prettify" @ mentions
        text = text.map(word => {
            const isAtMention = word.includes('@');
            const isAtCurrentUser = currentUser && currentUser.name && word.includes(currentUser.name);
            const atMentionClass = isAtCurrentUser ? 'at-mention-current' : 'at-mention-other';
            if (isAtMention) {
                return `<span class="${atMentionClass}">${word}</span>`;
            }
            return word;
        });

        return text.join(' ');
    }

    render() {
        const { messages, notifications, users } = this.props;
        const hasMessages = messages && Object.keys(messages).length > 0;
        const hasNotifications = notifications && notifications.length > 0;
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
                    {hasNotifications &&
                        notifications.map(notification => (
                            <Notification key={notification.id} message={notification} />
                        ))}
                </ul>
                <div className="chat-box" ref="chatBox">
                    <ul className="log">
                        {hasMessages &&
                            Object.keys(messages).map(id => {
                                const message = messages[id];
                                return (
                                    <li key={id}>
                                        <span className="meta">
                                            <span className="user">{message.user.name}</span>
                                            <span className="time">{this.getTime(message.timestamp)}</span>
                                        </span>
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
    messages: PropTypes.object.isRequired,
    notifications: PropTypes.array,
    users: PropTypes.object.isRequired,
};

const mapStateToProps = function(store) {
    // Get list of notifications specific to the current user
    const currentUser = api.users.getCurrentUser();
    let notifications = [];

    // If we have a current user, handle @ mentions
    if (currentUser && currentUser.name) {
        const currentAtMention = `@${currentUser.name}`;

        // Find messages directed at the current user
        for (const id in store.messages.new) {
            if (store.messages.new.hasOwnProperty(id)) {
                const message = store.messages.new[id];
                if (message.text.includes(currentAtMention)) {
                    notifications.push(message);
                }
            }
        }
    }

    return {
        messages: store.messages.all,
        notifications,
        users: store.users,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(ChatLog);
