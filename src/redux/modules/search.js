import url from "../../utils/url"
import { FETCH_DATA } from "../middleware/api"
import { schema as keywordSchema, getKeywordById } from "./entities/keywords"
import { combineReducers } from 'redux'
 
// action type 
const types = {
  // 搜索热门关键词
  FETCH_POPULAR_KEYWORDS_REQUEST: 'SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST',
  FETCH_POPULAR_KEYWORDS_SUCCESS: 'SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS',
  FETCH_POPULAR_KEYWORDS_FAILURE: 'SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE',
  // 文本输入搜索的相关关键词列表
  FETCH_RELATED_KEYWORDS_REQUEST: 'SEARCH/FETCH_RELATED_KEYWORDS_REQUEST',
  FETCH_RELATED_KEYWORDS_SUCCESS: 'SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS',
  FETCH_RELATED_KEYWORDS_FAILURE: 'SEARCH/FETCH_RELATED_KEYWORDS_FAILURE',
  // 设置当前输入
  SET_INPUT_TEXT: "SEARCH/SET_INPUT_TEXT",
  CLEAR_INPUT_TEXT: "SEARCH/CLEAR_INPUT_TEXT",
  // 历史查询记录
  ADD_HISTORY_KEYWORD: "SEARCH/ADD_HISTORY_KEYWORD",
  CLEAR_HISTORY_KEYWORDS: "SEARCH/CLEAR_HISTORY_KEYWORDS",
}

// state
const initialState = {
  inputText: '',
  popularKeywords: { // 热门关键字
    isFetching: false,
    ids: []
  },
  relatedKeywords: { // 根据搜索匡搜索出关联的列表数据
  },
  historyKeywords: [], // 表示保存的关键字
}

// actions
export const actions = {
  //  获取热门关键词
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      const { ids } = getState().search.popularKeywords
      if (ids.length  > 0) {
        return null
      }
      const endpoint = url.getPopularKeywords()
      return dispatch(fetchPopularKeywords(endpoint))
    }
  },
  // 根据搜索框搜索出来的列表数据
  loadRelatedKeywords: (text) => {
    return (dispatch, getState) => {
      const { relatedKeywords } = getState().search
      if (relatedKeywords[text]) {
        return null
      }
      const endpoint = url.getRelatedKeywords()
      return dispatch(fetchRelatedKeywords(text, endpoint))
    }
  },
  // 搜索框输入的内容
  setInputText: text => ({
    type: types.SET_INPUT_TEXT,
    text
  }),
  // 清空搜索框的内容
  clearInputText: () => ({
    type: types.CLEAR_INPUT_TEXT
  }),
  // 历史查询记录相关action
  addHistoryKeyword: keywordId => ({
    type: types.ADD_HISTORY_KEYWORD,
    text: keywordId
  }),
  clearHistoryKeywords: () => ({
    type: types.CLEAR_HISTORY_KEYWORDS
  })
}

const fetchPopularKeywords = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_POPULAR_KEYWORDS_REQUEST,
      types.FETCH_POPULAR_KEYWORDS_SUCCESS,
      types.FETCH_POPULAR_KEYWORDS_FAILURE,
    ],
    endpoint,
    schema: keywordSchema
  }
})

const fetchRelatedKeywords = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_RELATED_KEYWORDS_REQUEST,
      types.FETCH_RELATED_KEYWORDS_SUCCESS,
      types.FETCH_RELATED_KEYWORDS_FAILURE,
    ],
    endpoint,
    schema: keywordSchema
  },
  text
})

// reducers
const popularKeywords = (state = initialState.popularKeywords, action) => {
  switch(action.type) {
    case types.FETCH_POPULAR_KEYWORDS_REQUEST:
      return { ...state, isFetching: true }
    case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
      return { ...state, isFetching: false, ids:  state.ids.concat(action.response.ids) }
    case types.FETCH_POPULAR_KEYWORDS_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

const relatedKeywords = (state = initialState.relatedKeywords, action) => {
  switch(action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return {
        ...state,
        [action.text]:  relatedKeywordsByText(state[action.text], action)
      }
    default:
      return state
  }
}

//  数据尽可能的扁平化
const relatedKeywordsByText = (state = { isFetching: false, ids: [] }, action) => {
  switch(action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
      return { ...state, isFetching: true }
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
      return { ...state, isFetching: false, ids: state.ids.concat(action.response.ids) }
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

// 输入的内容
const inputText = (state = initialState.inputText, action)  => {
  switch(action.type) {
    case types.SET_INPUT_TEXT:
      return action.text
    case types.CLEAR_INPUT_TEXT:
      return ''
    default:
      return state
  }
}

// 历史关键字
const historyKeywords = (state = initialState.historyKeywords, action) => {
  switch(action.type) {
    case types.ADD_HISTORY_KEYWORD:
      const data = state.filter(item => item !== action.text)
      return [action.text, ...data]
    case types.CLEAR_HISTORY_KEYWORDS:
      return []
    default:
      return state
  }
}

export default combineReducers({
  popularKeywords,
  relatedKeywords,
  inputText,
  historyKeywords
})


// select函数，页面连接redux的第一步
export const getPopularKeywords = state => {
  return state.search.popularKeywords.ids.map(id => {
    return getKeywordById(state, id)
  })
}

export const getRelatedKeywords = state => {
  const text = state.search.inputText;
  if(!text || text.trim().length === 0) {
    return [];
  } 
  const relatedKeywords = state.search.relatedKeywords[text];
  if(!relatedKeywords) {
    return []
  }
  return relatedKeywords.ids.map(id => {
    return getKeywordById(state, id)
  })
}

export const getInputText = state => {
  return state.search.inputText
}

export const getHistoryKeywords = state => {
  return state.search.historyKeywords.map(id => {
    return getKeywordById(state, id)
  })
}
