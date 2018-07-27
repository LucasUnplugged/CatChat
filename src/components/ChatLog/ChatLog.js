import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../data/actions';
import { getTime, isSameDay, format } from 'date-fns';
import './ChatLog.css';

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
        const { messages } = this.props;
        const hasMessages = messages && Object.keys(messages).length > 0;

        return (
            <section className="ChatLog">
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
                                        <span className="text">{message.text}</span>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </section>
        );
    }
}

ChatLog.propTypes = {
    messages: PropTypes.object,
};

const mapStateToProps = store => {
    return {
        messages: store.messages.all,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(ChatLog);
