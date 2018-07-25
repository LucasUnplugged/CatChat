import React, { Component } from 'react';
import logo from '../../shared/assets/logo-grey.svg';
import './Spinner.css';

class Spinner extends Component {
    render() {
        return <img src={logo} className="Spinner" alt="Loading..." />;
    }
}

export default Spinner;
