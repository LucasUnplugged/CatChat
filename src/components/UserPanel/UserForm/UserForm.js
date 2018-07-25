import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../../../data/store';
import * as actions from '../../../data/actions';
import update from 'immutability-helper';
import * as api from '../../../data/api';
import './UserForm.css';
import '../../../shared/styles/variables.css';

class UserForm extends Component {
    constructor(props) {
        super(props);
        const { user } = props;

        this.state = {
            userName: user && user.name ? user.name : '',
            userText: user && user.text ? user.text : '',
            showDuplicateNameError: false,
        };

        this.setUsername = this.setUsername.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
        this.setUserChatInput = this.setUserChatInput.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { user } = newProps;
        this.setState({
            userName: user && user.name ? user.name : '',
            userText: user && user.text ? user.text : '',
            showDuplicateNameError: false,
        });
    }

    componentDidMount() {
        this.focus();
    }

    componentDidUpdate() {
        this.focus();
    }

    focus() {
        if (this.props.user) {
            this.refs.chatInput.focus();
        } else {
            this.refs.nameInput.focus();
        }
    }

    setUsername(event) {
        this.setState({ userName: event.target.value, showDuplicateNameError: false });
    }

    handleJoin(event) {
        event.preventDefault();

        const { users, addUser } = this.props;
        const { userName } = this.state;

        // Does name already exist?
        let isNameUnique = true;
        for (let key of Object.keys(users)) {
            let existingUser = users[key];
            if (existingUser.name.toLowerCase() === userName.toLowerCase()) {
                isNameUnique = false;
                break;
            }
        }

        if (isNameUnique) {
            // Add the user
            addUser({ name: userName });
        } else {
            this.setState({ showDuplicateNameError: true });
        }
    }

    setUserChatInput(event) {
        const { user } = this.props;

        let text = event.target.value;
        let updatedUser = update(user, {
            $merge: {
                text,
                typing: text && text.length > 0 ? true : false,
            },
        });

        this.setState({ userText: updatedUser.text });
        this.props.userChatInput(updatedUser);
    }

    removeUser() {
        const { user, removeUser } = this.props;
        removeUser(user);
    }

    handleSubmit(event) {
        event.preventDefault();
        // Add the message
        this.props.addMessage({
            user: this.props.user,
            text: this.props.user.text,
        });
        // Reset user's chat input
        store.dispatch({
            type: 'USER_CHAT_INPUT',
            user: { id: this.props.user.id, text: '', typing: false },
        });
        // Refocus
        this.refs.chatInput.focus();
    }

    render() {
        const { userName, userText, showDuplicateNameError } = this.state;
        const { user } = this.props;

        return user ? (
            <form className="UserForm" onSubmit={this.handleSubmit}>
                <header>
                    <h1>{userName}</h1>
                    <a className="control" onClick={this.removeUser}>
                        <span className="cc-icon-cancel" />
                    </a>
                </header>
                <fieldset className="button-input">
                    <input
                        type="text"
                        placeholder="Enter chat message"
                        value={userText}
                        onChange={this.setUserChatInput}
                        ref="chatInput"
                    />
                    <button type="submit">Send</button>
                </fieldset>
            </form>
        ) : (
            <form className="UserForm" onSubmit={this.handleJoin}>
                <header>
                    <h1>Join Chat</h1>
                </header>
                <fieldset className="button-input">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={this.setUsername}
                        ref="nameInput"
                        name="nameInput"
                    />
                    <button type="submit">Join</button>
                    {showDuplicateNameError ? (
                        <label htmlFor="nameInput" className="error">
                            Username already in use. Please try another.
                        </label>
                    ) : null}
                </fieldset>
            </form>
        );
    }
}

UserForm.propTypes = {
    user: PropTypes.object,
};

const mapStateToProps = function(store) {
    const currentUser = api.users.getCurrentUser();
    return {
        users: store.users,
        user: currentUser,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(UserForm);
