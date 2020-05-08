import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../../data/actions';
import Spinner from '../../Spinner/Spinner';
import './ActiveUser.css';
import '../../../shared/styles/variables.css';

class ActiveUser extends Component {
    constructor(props) {
        super(props);

        this.atMention = this.atMention.bind(this);
    }

    atMention(event) {
        const { atMention, user } = this.props;
        const isActionKeyDown = event && event.type === 'keydown' && (event.keyCode === 13 || event.keyCode === 32);
        const isClick = !event || event.type !== 'keydown';

        if (isActionKeyDown || isClick) {
            event.preventDefault();

            // @ mention user
            atMention({
                user,
            });
        }
    }

    render() {
        let user = this.props.user;
        return (
            <li
              className="ActiveUser"
              tabIndex={0}
              onClick={this.atMention}
              onKeyDown={this.atMention}
              title={`Send ${user.name} a message`}
            >
                <header>
                    <div className="status-wrapper">
                        {user.typing ? <Spinner /> : <span className="status-indicator" />}
                    </div>
                    <h1>{user.name}</h1>
                </header>
                <a className="at-message button">@</a>
            </li>
        );
    }
}

ActiveUser.propTypes = {
    id: PropTypes.string.isRequired,
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
