import React, { Component } from 'react';
import Header from '../Header/Header';
import UserPanel from '../UserPanel/UserPanel';
import ChatLog from '../ChatLog/ChatLog';
import './App.css';

class App extends Component {
    render() {
        return (
            <section className="App cc-grid-12">
                <Header />
                <UserPanel />
                <ChatLog />
            </section>
        );
    }
}

export default App;
