import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'

import {
  Blueprint,
  BlueprintState,
  Connection,
  Node,
} from 'store/blueprint/types'
import { ReduxState } from 'store/types'


export const getState = ({ blueprint }: ReduxState): BlueprintState => blueprint
export const getBlueprints = (
  ({ blueprint }: ReduxState): Record<string, Blueprint> => blueprint.blueprints
)
export const getCurrentBlueprintId = ({ blueprint }: ReduxState) => blueprint.currentBlueprintId
export const getConnections = (
  ({ blueprint }: ReduxState): Array<Connection> => blueprint.connections
)
export const getNodes = ({ blueprint }: ReduxState): Record<string, Node> => blueprint.nodes
export const getSelection = ({ blueprint }: ReduxState): Array<string> => blueprint.selection


export const getBreadcrumbs = createSelector(
  getBlueprints,
  getCurrentBlueprintId,
  (blueprints: Record<string, Blueprint>, uid: string): Array<string> => {
    let blueprint = blueprints[uid]
    const breadcrumbs = []
    while (blueprint) {
      breadcrumbs.push(blueprint.uid)
      blueprint = blueprints[blueprint.parentId]
    }
    return breadcrumbs.reverse()
  },
)

export const getSelectedConnections = createSelector(
  getConnections,
  getSelection,
  (connections: Array<Connection>, selection: Array<string>): Array<Connection> => (
    _reduce(connections, (acc: Array<Connection>, conn: Connection): Array<Connection> => {
      const uid = `${conn.sourceNodeId}.${conn.sourceName}--${conn.targetNodeId}.${conn.targetName}`
      if (selection.includes(uid)) {
        acc.push(conn)
      }
      return acc
    }, [])
  ),
)

export const getSelectedNodes = createSelector(
  getNodes,
  getSelection,
  (nodes: Record<string, Node>, selection: Array<string>): Array<Node> => _reduce(
    selection, (acc: Array<Node>, uid: string): Array<Node> => {
      const node = nodes[uid]
      if (node) {
        acc.push(node)
      }
      return acc
    }, [],
  ),
)

export const getSelectedNode = createSelector(
  getSelectedNodes,
  (selectedNodes: Array<Node>): Node | undefined => (
    selectedNodes.length ? selectedNodes[0] : undefined
  ),
)

export const getConnectionHints = createSelector(
  getNodes,
  getSelectedNode,
  getConnections,
  (nodes, selected, connections): Record<string, string> => {
    const hints: Record<string, string> = {}
    if (selected) {
      for (const conn of connections) {
        if (conn.targetNodeId === selected.uid) {
          const sourceNode = nodes[conn.sourceNodeId]
          const hint = `$("${sourceNode.label}"."${conn.sourceName}")`
          if (hints[conn.sourceName]) {
            hints[conn.sourceName] += `, ${hint}`
          } else {
            hints[conn.sourceName] = hint
          }
        }
      }
    }
    return hints
  },
)
