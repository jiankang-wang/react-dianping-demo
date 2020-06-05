import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoginHeader from './components/LoginHeader'
import LoginForm from './components/LoginForm'
import {
  actions as loginActions,
  getUsername,
  getPassword,
  isLogin
} from '../../redux/modules/login'

class Login extends Component {

  handleChange = (e) => {
    if (e.target.name === 'username') {
      this.props.loginActions.setUsername(e.target.value)
    }
    if (e.target.name === 'password') {
      this.props.loginActions.setPassword(e.target.value)
    }
  }

  handleSubmit = () => {
    this.props.loginActions.login()
  }


  render() {
    const {
      username,
      password,
      login,
      location: { state }
    } = this.props

    if (login) {
      if(state && state.from) {
        return <Redirect to={state.from} />
      }
      return <Redirect to="/user" />;
    }
    
    return (
      <div>
        <LoginHeader />
        <LoginForm
          username={username}
          password={password}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    username: getUsername(state),
    password: getPassword(state),
    login: isLogin(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginActions: bindActionCreators(loginActions, dispatch)
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Login)