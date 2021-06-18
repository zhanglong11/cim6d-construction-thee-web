export default function (treeData, fn, childrenkey = 'children') {
  let result = null
  c(treeData, null)
  function c(list, parent) {
    for (let item of list) {
      if (result) return false
      if (fn(item)) {
        if (parent) item.parent = parent
        result = item
      }
      if (item[childrenkey]) {
        c(item[childrenkey], item)
      }
    }
  }
  return result
}
