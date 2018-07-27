import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../data/actions';
import update from 'immutability-helper';
import * as api from '../../../data/api';
import InputForm from './InputForm/InputForm';
import '../../../shared/styles/variables.css';

class UserForm extends Component {
    constructor(props) {
        super(props);
        const { user } = props;

        this.state = {
            userName: user ? user.name : '',
            userText: user ? user.text : '',
        };

        this.setUsername = this.setUsername.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
        this.setUserChatInput = this.setUserChatInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { user } = newProps;
        this.setState({
            userName: user ? user.name : '',
            userText: user ? user.text : '',
        });
    }

    setUsername(event) {
        this.setState({ userName: event.target.value });
    }

    handleJoin(event) {
        const { addUser } = this.props;
        const { userName } = this.state;

        event.preventDefault();

        // Ignore this action if the name is empty
        if (userName.trim().length === 0) {
            return;
        }

        // Add the user
        addUser({ name: userName });
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

    handleSubmit(event) {
        event.preventDefault();
        // Add the message
        this.props.addMessage({
            user: this.props.user,
            text: this.props.user.text,
        });
    }

    render() {
        const { userName, userText } = this.state;
        const { user } = this.props;

        return user ? (
            <InputForm
                onSubmit={this.handleSubmit}
                onChange={this.setUserChatInput}
                onClose={this.removeUser}
                title={userName}
                placeholder="Enter chat message"
                text={userText}
                inputName="chatInput"
                submitText="Send"
            />
        ) : (
            <InputForm
                onSubmit={this.handleJoin}
                onChange={this.setUsername}
                title="Join Chat"
                placeholder="Enter your name"
                text={userName}
                inputName="nameInput"
                submitText="Join"
            />
        );
    }
}

UserForm.propTypes = {
    user: PropTypes.object,
};

const mapStateToProps = () => {
    return {
        user: api.users.getCurrentUser(),
    };
};

export default connect(
    mapStateToProps,
    actions,
)(UserForm);
