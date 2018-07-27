import React, { Component } from 'react';
import UserForm from './UserForm/UserForm';
import './UserPanel.css';
import '../../shared/styles/grid.css';

class UserPanel extends Component {
    render() {
        return (
            <aside className="UserPanel">
                <UserForm />
            </aside>
        );
    }
}

export default UserPanel;
