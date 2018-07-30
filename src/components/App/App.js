import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../Header/Header';
import UserPanel from '../UserPanel/UserPanel';
import ChatLog from '../ChatLog/ChatLog';
import './App.css';

class App extends Component {
    render() {
        const { users } = this.props;
        return (
            <section className="App cc-grid-12">
                <Header users={users} />
                <UserPanel />
                <ChatLog />
            </section>
        );
    }
}

App.propTypes = {
    users: PropTypes.object,
};

const mapStateToProps = store => {
    return {
        users: store.users,
    };
};

export default connect(mapStateToProps)(App);
