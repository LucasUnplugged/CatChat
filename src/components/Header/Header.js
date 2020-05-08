import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from '../../shared/assets/logo-grey.svg';
import './Header.css';

class Header extends Component {
    render() {
        const { users } = this.props;
        let userCount = users && Object.keys(users).length > 0 ? Object.keys(users).length : 0;

        return (
            <header className="Header">
                <img src={logo} className="logo" alt="Ying-Yang Cat logo" />
                <h1 className="wordmark">
                    Cat<strong>Chat</strong>
                </h1>
                {userCount > 0 && (
                    <span className="badge">
                        {userCount}&nbsp;
                        <span className={`fas ${userCount > 1 ? 'fa-users' : 'fa-user'}`} />
                    </span>
                )}
            </header>
        );
    }
}

Header.propTypes = {
    users: PropTypes.object,
};

export default Header;
