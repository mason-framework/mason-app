import _keyBy from 'lodash/keyBy'
import _get from 'lodash/get'
import { createSelector } from 'reselect'
import {
  Delta,
  GraphConnection,
  GraphNode,
  GraphState,
} from 'store/graph/types'
import { ReduxState } from 'store/types'

function mapConnection(
  connection: GraphConnection,
  nodeMap: Record<string, GraphNode>,
  deltas: Record<string, Delta>,
): GraphConnection {
  let {
    sourceX,
    sourceY,
    targetX,
    targetY,
  } = connection
  const sourceNodeId = (connection.source || '').split('.')[0]
  const targetNodeId = (connection.target || '').split('.')[0]
  const sourceNode = nodeMap[sourceNodeId]
  const targetNode = nodeMap[targetNodeId]

  if (sourceNode) {
    const { dx, dy } = _get(deltas, sourceNodeId, { dx: 0, dy: 0 })
    sourceX = (sourceNode.x || 0) + dx
    sourceY = (sourceNode.y || 0) + dy
  }

  if (targetNode) {
    const { dx, dy } = _get(deltas, targetNodeId, { dx: 0, dy: 0 })
    targetX = (targetNode.x || 0) + dx
    targetY = (targetNode.y || 0) + dy
  }

  return {
    ...connection,
    sourceX,
    sourceY,
    targetX,
    targetY,
  }
}

export const getGraph = ({ graph }: ReduxState): GraphState => graph
export const getDeltas = ({ graph }: ReduxState): Record<string, Delta> => graph.deltas
export const getNodes = ({ graph }: ReduxState): Array<GraphNode> => graph.nodes
export const getNodeConnections = (
  { graph }: ReduxState,
): Array<GraphConnection> => graph.nodeConnections
export const getConnection = (
  { graph }: ReduxState,
): GraphConnection | undefined => graph.connection
export const getSelectedNodeId = ({ graph }: ReduxState): string => graph.selectedNodeId

export const getIsConnecting = createSelector(
  getConnection,
  (connection): boolean => !!connection,
)

export const getNodeMap = createSelector(
  getNodes,
  (nodes: Array<GraphNode>): Record<string, GraphNode> => _keyBy(nodes, 'uid'),
)

export const getConnections = createSelector(
  getGraph,
  getConnection,
  getNodeMap,
  getDeltas,
  ({ nodeConnections }, connection, nodeMap, deltas): Array<GraphConnection> => {
    const connections = nodeConnections.map((conn) => mapConnection(conn, nodeMap, deltas))
    if (connection) {
      connections.push(connection)
    }
    return connections
  },
)
