import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'
import { ReduxState } from 'store/types'
import { getConnections, getNodes } from 'store/blueprint/selectors'
import { Connection, Node } from 'store/blueprint/types'

export const getSelection = ({ selection }: ReduxState): Array<string> => selection.selection

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
  getConnections,
  getSelectedNode,
  (nodes, connections, selected): Record<string, string> => {
    const hints: Record<string, string> = {}
    if (selected) {
      for (const conn of connections) {
        if (conn.targetNodeId === selected.uid) {
          const sourceNode = nodes[conn.sourceNodeId]
          const hint = `$("${sourceNode.label}"."${conn.sourceName}")`
          if (hints[conn.targetName]) {
            hints[conn.targetName] += `, ${hint}`
          } else {
            hints[conn.targetName] = hint
          }
        }
      }
    }
    return hints
  },
)
