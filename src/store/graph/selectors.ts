import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'

import {
  Connection,
  Node,
  PositionDelta,
} from 'store/blueprint/types'
import {
  getConnections as getBlueprintConnections,
  getNodes as getBlueprintNodes,
  getCurrentNodeIds,
} from 'store/blueprint/selectors'
import { GraphState, Position, ConnectorSuggestion } from 'store/graph/types'
import { ReduxState } from 'store/types'

function mapToNode(
  connection: Connection,
  nodes: Record<string, Node>,
  deltas: Record<string, PositionDelta>,
): Connection {
  let { sourcePos, targetPos } = connection
  const { sourceNodeId, targetNodeId } = connection
  const sourceNode = nodes[sourceNodeId]
  const targetNode = nodes[targetNodeId]
  if (sourceNode) {
    const { dx, dy } = deltas[sourceNodeId] || { dx: 0, dy: 0 }
    sourcePos = {
      ...sourcePos,
      x: sourceNode.x + dx,
      y: sourceNode.y + dy,
    }
  }
  if (targetNode) {
    const { dx, dy } = deltas[targetNodeId] || { dx: 0, dy: 0 }
    targetPos = {
      ...targetPos,
      x: targetNode.x + dx,
      y: targetNode.y + dy,
    }
  }
  return { ...connection, sourcePos, targetPos }
}

export const getGraph = ({ graph }: ReduxState): GraphState => graph
export const getConnector = ({ graph }: ReduxState): Connection | undefined => graph.connector
export const getNodeDeltas = (
  ({ graph }: ReduxState): Record<string, PositionDelta> => graph.nodeDeltas
)
export const getSuggestionsPosition = (
  ({ graph }: ReduxState): Position => graph.suggestionsPosition
)
export const getSuggestionsSearch = (
  ({ graph }: ReduxState): string => graph.suggestionsSearch
)

export const getSuggestions = createSelector(
  getGraph,
  getSuggestionsSearch,
  (graph, terms): Array<ConnectorSuggestion> | undefined => {
    if (!graph.suggestions) return undefined
    return (!terms ? graph.suggestions : graph.suggestions.filter(
      ({ schema, name }) => (
        name.toLowerCase().includes(terms.toLowerCase())
        || schema.name.toLowerCase().includes(terms.toLowerCase())
      ),
    ))
  },
)

export const getIsConnecting = createSelector(
  getConnector,
  (connector): boolean => !!connector,
)

export const getNodes = createSelector(
  getBlueprintNodes,
  getCurrentNodeIds,
  (nodes, uids) => _reduce(uids, (acc: Array<Node>, uid: string): Array<Node> => {
    const node = nodes[uid]
    if (node) {
      acc.push(node)
    }
    return acc
  }, []),
)

export const getConnections = createSelector(
  getBlueprintConnections,
  getConnector,
  getBlueprintNodes,
  getNodeDeltas,
  (connections, connector, nodes, deltas): Array<Connection> => {
    const mapped = connections.map((conn) => mapToNode(conn, nodes, deltas))
    if (connector) {
      mapped.push(connector)
    }
    return mapped
  },
)
