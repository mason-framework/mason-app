import _get from 'lodash/get'
import _keyBy from 'lodash/keyBy'
import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'
import {
  GraphConnection,
  GraphDelta,
  GraphNode,
  GraphState,
} from 'store/graph/types'
import { ReduxState } from 'store/types'

function mapConnection(
  connection: GraphConnection,
  nodeMap: Record<string, GraphNode>,
  deltas: Record<string, GraphDelta>,
): GraphConnection {
  let { sourcePos, targetPos } = connection
  const sourceNodeId = connection.source.split('.')[0]
  const targetNodeId = connection.target.split('.')[0]
  const sourceNode = nodeMap[sourceNodeId]
  const targetNode = nodeMap[targetNodeId]
  if (sourceNode) {
    const { dx, dy } = _get(deltas, sourceNodeId, { dx: 0, dy: 0 })
    sourcePos = {
      ...sourcePos,
      x: sourceNode.x + dx,
      y: sourceNode.y + dy,
    }
  }
  if (targetNode) {
    const { dx, dy } = _get(deltas, targetNodeId, { dx: 0, dy: 0 })
    targetPos = {
      ...targetPos,
      x: targetNode.x + dx,
      y: targetNode.y + dy,
    }
  }
  return {
    ...connection,
    sourcePos,
    targetPos,
  }
}

export const getGraph = ({ graph }: ReduxState): GraphState => graph
export const getConnector = ({ graph }: ReduxState): GraphConnection | undefined => graph.connector
export const getDeltas = ({ graph }: ReduxState): Record<string, GraphDelta> => graph.deltas
export const getSelection = ({ graph }: ReduxState): Array<string> => graph.selection
export const getConnections = ({ graph }: ReduxState): Array<GraphConnection> => graph.connections
export const getNodes = ({ graph }: ReduxState): Array<GraphNode> => graph.nodes

export const getIsConnecting = createSelector(
  getConnector,
  (connector): boolean => !!connector,
)

export const getNodeMap = createSelector(
  getNodes,
  (nodes): Record<string, GraphNode> => _keyBy(nodes, 'uid'),
)

export const getMappedConnections = createSelector(
  getConnector,
  getConnections,
  getNodeMap,
  getDeltas,
  (connector, connections, nodeMap, deltas): Array<GraphConnection> => {
    const mapped = connections.map((conn) => mapConnection(conn, nodeMap, deltas))
    if (connector) {
      mapped.push(connector)
    }
    return mapped
  },
)

export const getSelectedNodeId = createSelector(
  getSelection,
  (selection): string => selection[0] || '',
)

export const getSelectedConnectionTargets = createSelector(
  getSelectedNodeId,
  getConnections,
  getNodeMap,
  (uid, connections, nodeMap): Record<string, Array<string>> => (
    _reduce(
      connections,
      (
        acc: Record<string, Array<string>>,
        connection: GraphConnection,
      ): Record<string, Array<string>> => {
        const [targetId, targetItem] = (connection.target || '.').split('.')
        const [sourceId, sourceItem] = (connection.source || '.').split('.')
        const source = nodeMap[sourceId]
        if (targetId === uid && source) {
          return {
            ...acc,
            [targetItem]: [
              ...(acc[targetItem] || []),
              `$("${source.label}"."${sourceItem}")`,
            ],
          }
        }
        return acc
      },
      {},
    )
  ),
)
