import React from 'react';
import { Box, Button, TextInput, Form } from 'grommet';

class PasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { password: "", passwordRepetition: "" };
    }

    onChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    onSubmitHandler = (event) => {
        if (!this.props.repeat && this.state.password === this.state.passwordRepetition) {
            alert("Passwörter stimmen nicht überein.");
        } else {
            this.props.onComplete(this.state.password);
        }
        this.setState({ password: "", passwordRepetition: "" });
    }

    onEnterHandler = (event) => {
        if(event.key === "Enter"){
            this.onSubmitHandler();
        }
    }

    render() {
        return (
            <Box className="PasswordForm" direction="column" gap="small" pad="small">
                <Form>
                    <TextInput name="password" placeholder="Password" type="password" onChange={this.onChangeHandler} onKeyDown={this.onEnterHandler} value={this.state.password}></TextInput>
                    {this.props.repeat &&
                        <TextInput name="passwordRepetition" placeholder="Repeat Password" type="password" onChange={this.onChangeHandler} value={this.state.passwordRepetition}></TextInput>
                    }
                    <Button onClick={this.onSubmitHandler}>Eingeben</Button>
                </Form>
            </Box>
        );
    }
}

export default PasswordForm;