import createReducer from "../../../utils/createReducer";

export const schema = {
  name: "keywords",
  id: "id"
};

const reducer = createReducer(schema.name);

export default reducer;

// 定义select函数
export const getKeywordById = (state, id) => {
  return state.entities.keywords[id]
}
