import createReducer from '../../../utils/createReducer'

export const schema = {
  name: 'shops',
  id: 'ids'
}

export default createReducer('shops')

// 定义selector函数
export const getShopById = (state, id) => {
  const shop = state.entities.shops[id];
  return shop
}
