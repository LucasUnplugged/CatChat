import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../data/actions';
import Spinner from '../../Spinner/Spinner';
import './ActiveUser.css';
import '../../../shared/styles/variables.css';

class ActiveUser extends Component {
    render() {
        let user = this.props.user;
        return (
            <li className="ActiveUser">
                <header>
                    <div className="status-wrapper">
                        {user.typing ? <Spinner /> : <span className="status-indicator" />}
                    </div>
                    <h1>{user.name}</h1>
                </header>
            </li>
        );
    }
}

ActiveUser.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (store, props) => {
    return {
        user: store.users[props.id],
    };
};

export default connect(
    mapStateToProps,
    actions,
)(ActiveUser);
