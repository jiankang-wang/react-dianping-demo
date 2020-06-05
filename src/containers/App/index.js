import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"
import { connect } from "react-redux";
import ErrorToast from "../../components/ErrorToast";
import { actions as appActions, getError } from "../../redux/modules/app";
import AsyncComponent from '../../utils/AsyncConponent'
// import ProductDetail from '../ProductDetail'
// import Home from '../Home'
// import Search from '../Search'
// import SearchResult from '../SearchResult'
// import Login from '../Login'
// import User from '../Use'
import PrivateRoute from "../PrivateRoute";

// 分片加载
const Home = AsyncComponent(() => import('../Home'))
const Search = AsyncComponent(() => import('../Search'))
const SearchResult = AsyncComponent(() => import('../SearchResult'))
const Login = AsyncComponent(() => import('../Login'))
const User = AsyncComponent(() => import('../Use'))
const ProductDetail = AsyncComponent(() => import('../ProductDetail'))

class App extends Component {
  render() {
    
    const {
      error,
      appActions: { clearError }
    } = this.props;

    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path='/user' component={User} />
            <Route path="/detail/:id" component={ProductDetail} />
            <Route path="/search" component={Search} />
            <Route path="/search_result" component={SearchResult} />
            <Route path="/" component={Home} />
          </Switch>
        </Router>  
        {error ? <ErrorToast msg={error} clearError={clearError} /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    error: getError(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
