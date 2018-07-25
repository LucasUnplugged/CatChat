import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../data/actions';
import './Notification.css';

const NOTIFICATION_TIMEOUT = 3000;
const ANIMATION_DELAY = 1500;

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            animationState: 'off',
        };
    }

    componentWillUnmount() {
        clearTimeout(this.stateTimer);
    }

    componentDidMount() {
        this.setState({ isVisible: true });
    }

    componentDidUpdate() {
        const { animationState } = this.state;

        switch (animationState) {
            case 'off':
                // Start
                this.stateTimer = setTimeout(() => {
                    this.setState({ animationState: 'enter' });
                });
                break;

            case 'enter':
                // Fade in
                this.stateTimer = setTimeout(() => {
                    this.setState({ animationState: 'done' });
                }, ANIMATION_DELAY);
                break;

            case 'done':
                // Wait to fade out
                this.stateTimer = setTimeout(() => {
                    this.setState({ animationState: 'exit' });
                }, NOTIFICATION_TIMEOUT);
                break;

            case 'exit':
                // Fade out
                this.stateTimer = setTimeout(() => {
                    this.setState({ isVisible: false });

                    // Mark this notification as read
                    this.markAsRead();
                }, ANIMATION_DELAY);
                break;

            default:
        }
    }

    markAsRead() {
        const { message, markMessageAsRead } = this.props;
        markMessageAsRead(message);
    }

    render() {
        const { isVisible, animationState } = this.state;
        const { message } = this.props;
        let animationClass = 'off';

        switch (animationState) {
            case 'enter':
                // Fade in
                animationClass = 'enter';
                break;

            case 'done':
                // Display
                animationClass = 'done';
                break;

            case 'exit':
                // Fade out
                animationClass = 'exit';
                break;

            default:
        }

        return message && isVisible ? (
            <li className={`Notification ${animationClass}`} key={message.id}>
                <strong className="sender">{message.user.name}: </strong>
                {message.text}
            </li>
        ) : null;
    }
}

Notification.propTypes = {
    message: PropTypes.object.isRequired,
};

export default connect(
    null,
    actions,
)(Notification);
