import _reduce from 'lodash/reduce'
import _values from 'lodash/values'
import { createSelector } from 'reselect'

import {
  Connection,
  Node,
  PositionDelta,
} from 'store/blueprint/types'
import {
  getConnections as getBlueprintConnections,
  getNodes as getBlueprintNodes,
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

export const getConnectedHotspotIds = createSelector(
  getBlueprintConnections,
  getConnector,
  (connections, connector): Record<string, boolean> => {
    const hotspotIds = _reduce(
      connections,
      (
        acc: Record<string, boolean>,
        connection: Connection,
      ) => {
        const source = `${connection.sourceNodeId}.${connection.sourceName}`
        const target = `${connection.targetNodeId}.${connection.targetName}`
        acc[source] = true
        acc[target] = true
        return acc
      },
      {},
    )
    if (connector && connector.sourceNodeId) {
      const source = `${connector.sourceNodeId}.${connector.sourceName}`
      hotspotIds[source] = true
    } else if (connector && connector.targetNodeId) {
      const target = `${connector.targetNodeId}.${connector.targetName}`
      hotspotIds[target] = true
    }
    return hotspotIds
  },
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
  (nodes): Array<Node> => _values(nodes),
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
