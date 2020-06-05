import React, { Component } from 'react';
import SearchHeader from './components/SearchHeader'
import ShopList from './components/ShopList'
import KeywordBox from './components/KeywordBox'
import Banner from '../../components/Banner'

class SearchResult extends Component {

  handleBack = () => {
    this.props.history.push('/')
  }

  handleSearch = () => {
    this.props.history.push('/search')
  }

  render() {
    return (
      <div>
        <SearchHeader onBack={this.handleBack} onSearch={this.handleSearch} />
        <KeywordBox text="text" />
        <Banner dark />
        <ShopList />
      </div>
    );
  }
}

export default SearchResult;