import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InputForm.css';

class InputForm extends Component {
    componentDidMount() {
        this.refs.input.focus();
    }

    componentDidUpdate() {
        this.refs.input.focus();
    }

    render() {
        const {
            onSubmit,
            onChange,
            onClose,
            title,
            placeholder,
            text,
            inputName,
            submitText,
            errorMessage,
        } = this.props;

        return (
            <form className="InputForm" onSubmit={onSubmit}>
                <header>
                    <h1>{title}</h1>
                    {onClose ? (
                        <a className="control" tabIndex={1} onClick={onClose} onKeyDown={onClose}>
                            <span className="fas fa-times" />
                        </a>
                    ) : null}
                </header>
                <fieldset className="button-input">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={text}
                        onChange={onChange}
                        ref="input"
                        name={inputName}
                        id={inputName}
                    />
                    <button type="submit">{submitText}</button>
                    {errorMessage ? (
                        <label htmlFor={inputName} className="error">
                            {errorMessage}
                        </label>
                    ) : null}
                </fieldset>
            </form>
        );
    }
}

InputForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string,
    inputName: PropTypes.string.isRequired,
    submitText: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
};

export default InputForm;
