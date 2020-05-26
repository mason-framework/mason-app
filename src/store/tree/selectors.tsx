import _capitalize from 'lodash/capitalize'
import _includes from 'lodash/includes'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values'
import { createSelector } from 'reselect'
import { getLibraryNodes } from 'store/server/selectors'
import { LibraryNode } from 'store/server/types'
import { ReduxState } from 'store/types'
import { TreeState, LibraryNodeTreeItemModel } from 'store/tree/types'
import LibraryNodeTreeItem from 'components/LibraryNodeTreeItem'
import React from 'react'

export const getTree = ({ tree }: ReduxState): TreeState => tree

export const getNodeSearch = createSelector(
  getTree, ({ nodeSearch }: TreeState): string => nodeSearch,
)

export const getLibraryNodeTree = createSelector(
  getLibraryNodes,
  getNodeSearch,
  (nodes: Array<LibraryNode>, terms: string): Array<LibraryNodeTreeItemModel> => _values(
    _reduce(nodes, (acc: Record<string, LibraryNodeTreeItemModel>, node: LibraryNode) => {
      const { group, name } = node
      const key = `${group}.${name}`
      if (!terms) {
        if (!acc[group]) {
          acc[group] = {
            title: _capitalize(group),
            key: group,
            children: [],
          }
        }
        acc[group].children.push({
          title: <LibraryNodeTreeItem nodeType={node} name={name} />,
          key,
          children: [],
        })
      } else if (_includes(name.toLowerCase(), terms.toLowerCase())) {
        acc[key] = {
          title: <LibraryNodeTreeItem nodeType={node} name={name} />,
          key,
          children: [],
        }
      }
      return acc
    }, {}),
  ),
)
