import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
            userName: user ? user.name : '',
            userText: user ? user.text : '',
            showDuplicateNameError: false,
        };

        this.setUsername = this.setUsername.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
        this.setUserChatInput = this.setUserChatInput.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.initializeUserForm();
    }

    componentDidUpdate() {
        this.initializeUserForm();
    }

    componentWillReceiveProps(newProps) {
        const { user } = newProps;
        this.setState({
            userName: user ? user.name : '',
            userText: user ? user.text : '',
            showDuplicateNameError: false,
        });
    }

    initializeUserForm() {
        const { user, removeUser } = this.props;

        // Activate this form item
        this.focus();

        if (user) {
            // Remove the user when the window closes
            window.addEventListener('beforeunload', () => {
                // Save the user to localStorage
                localStorage.setItem('ccSavedUser', JSON.stringify(user));

                // Remove the user from the DB
                removeUser(user);
            });
        } else {
            // Look for a locally saved user
            this.addSavedUser();
        }
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
        const { users, addUser } = this.props;
        const { userName } = this.state;
        const lowerCaseName = userName.toLowerCase();

        event.preventDefault();

        // Ignore this action if the name is empty
        if (userName.trim().length === 0) {
            return;
        }

        // Does name already exist?
        let isNameUnique = true;
        for (let key of Object.keys(users)) {
            let existingUser = users[key];
            if (existingUser.name.toLowerCase() === lowerCaseName) {
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
        const text = event.target.value;

        const updatedUser = update(user, {
            $merge: {
                text,
                typing: text && text.length > 0 ? true : false,
            },
        });

        this.setState({ userText: updatedUser.text });
        this.props.userChatInput(updatedUser);
    }

    addSavedUser() {
        const { addUser } = this.props;

        // Get the user from local storage
        let savedUser = localStorage.getItem('ccSavedUser');
        if (savedUser && savedUser !== 'undefined') {
            savedUser = JSON.parse(savedUser);
            addUser(savedUser);

            // Once the user is added, remove it from localStorage
            localStorage.removeItem('ccSavedUser');
        }
    }

    removeUser(event) {
        const { user, removeUser } = this.props;
        const isActionKeyDown = event && event.type === 'keydown' && (event.keyCode === 13 || event.keyCode === 32);
        const isClick = !event || event.type !== 'keydown';

        if (isActionKeyDown || isClick) {
            event.preventDefault();

            // Remove user from localStorage
            localStorage.removeItem('ccSavedUser');

            // Remove the user from the DB
            removeUser(user);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        // Add the message
        this.props.addMessage({
            user: this.props.user,
            text: this.props.user.text,
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
                    <a className="control" tabIndex={1} onClick={this.removeUser} onKeyDown={this.removeUser}>
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
    users: PropTypes.object,
    user: PropTypes.object,
};

const mapStateToProps = store => {
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
