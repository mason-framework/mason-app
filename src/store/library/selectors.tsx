import React from 'react'

import _camelCase from 'lodash/camelCase'
import _includes from 'lodash/includes'
import _reduce from 'lodash/reduce'
import _startCase from 'lodash/startCase'
import _values from 'lodash/values'
import { createSelector } from 'reselect'

import { ReduxState } from 'store/types'
import LibraryTreeNodeItem from 'components/LibraryTreeNodeItem'

import {
  LibraryState,
  NodeSchema,
  LibraryTreeNode,
} from 'store/library/types'

export const getLibrary = ({ library }: ReduxState): LibraryState => library
export const getNodes = ({ library }: ReduxState): Array<NodeSchema> => library.nodes
export const getSearchTerms = ({ library }: ReduxState): string => library.searchTerms

export const getNodeMap = createSelector(
  getNodes,
  (nodes): Record<string, NodeSchema> => _reduce(
    nodes,
    (acc: Record<string, NodeSchema>, schema: NodeSchema): Record<string, NodeSchema> => {
      acc[`${schema.group}.${schema.name}`] = schema
      return acc
    },
    {},
  ),
)

export const getNodeTree = createSelector(
  getNodes,
  getSearchTerms,
  (nodes: Array<NodeSchema>, terms: string): Array<LibraryTreeNode> => _values(
    _reduce(nodes, (acc: Record<string, LibraryTreeNode>, node: NodeSchema) => {
      const { group, name } = node
      const key = `${group}.${name}`
      if (!terms) {
        if (!acc[group]) {
          acc[group] = {
            title: _startCase(_camelCase(group)),
            key: group,
            children: [],
          }
        }
        acc[group].children.push({
          title: (<LibraryTreeNodeItem node={node} name={name} />),
          key,
          children: [],
        })
      } else if (_includes(name.toLowerCase(), terms.toLowerCase())) {
        acc[key] = {
          title: (<LibraryTreeNodeItem node={node} name={name} />),
          key,
          children: [],
        }
      }
      return acc
    }, {}),
  ),
)
