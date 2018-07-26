import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserForm from './UserForm/UserForm';
import ActiveUser from './ActiveUser/ActiveUser';
import * as actions from '../../data/actions';
import * as api from '../../data/api';
import './UserPanel.css';
import '../../shared/styles/grid.css';

class UserPanel extends Component {
    componentWillMount() {
        this.props.getUsers();
    }

    render() {
        const { users } = this.props;
        const currentUser = api.users.getCurrentUser();
        const hasActiveUsers =
            users && ((!currentUser && Object.keys(users).length > 0) || Object.keys(users).length > 1);

        return (
            <aside className="UserPanel">
                <UserForm />
                <div className="connected-users">
                    <header>
                        <h1>Connected Users</h1>
                    </header>
                    <ul className="user-list">
                        {hasActiveUsers ? (
                            Object.keys(users).map(key => {
                                let user = users[key];
                                return currentUser && user.id === currentUser.id ? null : (
                                    <ActiveUser key={user.id} id={user.id} />
                                );
                            })
                        ) : (
                            <li>No {currentUser ? 'other ' : ''}active users</li>
                        )}
                    </ul>
                </div>
            </aside>
        );
    }
}

UserPanel.propTypes = {
    users: PropTypes.object,
};

const mapStateToProps = function(store) {
    return {
        users: store.users,
    };
};

export default connect(
    mapStateToProps,
    actions,
)(UserPanel);
