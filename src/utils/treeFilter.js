import toTree from '@/utils/toTree'
import toFlat from '@/utils/toFlat'
import _ from 'lodash'

/**
 *
 * @param flatList
 * @param fn
 * @param strict 严格模式只有精确匹配到的节点才显示出来
 * @returns {Array}
 */
export default function (flatList, fn, strict) {
  const treeData = toTree(flatList)
  const flatData = toFlat(treeData)
  const dict = _.keyBy(flatData, 'id')
  const allowItemList = flatData.filter(e => fn(e, dict[e.pid]))
  const result = _.chain(allowItemList)
    .map(e => (strict ? e : e.ancestorIds))
    .flatten()
    .union()
    .map(id => dict[id])
    .concat(allowItemList)
    .compact()
    .unionBy('id')
    .value()
  return toTree(result)
}
