/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Bar } from '@vx/shape'
import { Group } from '@vx/group'
import { scaleBand, scaleLinear } from '@vx/scale'
import { AxisLeft, AxisTop } from '@vx/axis'

import { NodeTimeline, TimelineEvent } from 'store/profile/types'


interface Props {
  height: number
  lineHeight?: number
  timelines: Array<NodeTimeline>
  totalTime: number
  width: number
}

interface TimelineEventProps {
  event: TimelineEvent
  height: number
  totalTime: number
  xScale: any
  y: number
}


const TimelineEventItem = ({
  event,
  xScale,
  totalTime,
  y,
  height,
}: TimelineEventProps) => {
  const left = xScale(event.startedAt)
  const right = xScale(event.endedAt || totalTime)
  const barWidth = Math.max(right - left, 2)
  return (
    <Bar
      fill="#303030"
      height={height}
      key={event.uid}
      stroke="#aaa"
      width={barWidth}
      x={left}
      y={y}
    />
  )
}

const TimelineGraph = ({
  height,
  lineHeight = 16,
  timelines,
  totalTime,
  width,
}: Props) => {
  const xScale = scaleLinear<number>({
    domain: [0, totalTime || 1],
    range: [0, width - 150],
  })

  const yScale = scaleBand<string>({
    domain: timelines.map((timeline) => timeline.uid),
    range: [0, (lineHeight + 4) * timelines.length],
  })

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#0a0a0a" />
      {!!timelines.length && (
        <Group top={59} left={110}>
          {timelines.map((timeline) => (
            <Group key={timeline.uid}>
              {timeline.events.map((event) => (
                <TimelineEventItem
                  event={event}
                  height={lineHeight - 4}
                  totalTime={totalTime}
                  xScale={xScale}
                  y={yScale(timeline.uid) || 0}
                />
              ))}
              {timeline.stack.map((event) => (
                <TimelineEventItem
                  event={event}
                  height={lineHeight - 4}
                  totalTime={totalTime}
                  xScale={xScale}
                  y={yScale(timeline.uid) || 0}
                />
              ))}
            </Group>
          ))}
        </Group>
      )}
      <Group top={0} left={10}>
        <AxisLeft
          top={55}
          left={90}
          scale={yScale}
          stroke="#aaa"
          tickStroke="#aaa"
          tickLabelProps={() => ({
            fill: '#aaa',
            textAnchor: 'start',
            fontSize: 10,
            fontFamily: 'Arial',
            dx: -80,
            dy: '0.5em',
          })}
          tickFormat={(_, index) => timelines[index].label}
          tickComponent={({ formattedValue, ...tickProps }) => (
            <text {...tickProps}>{formattedValue}</text>
          )}
        />
        <AxisTop
          top={55}
          left={90}
          stroke="#aaa"
          tickStroke="#aaa"
          labelProps={{
            fill: '#aaa',
            textAnchor: 'middle',
            fontSize: 12,
            fontFamily: 'Arial',
          }}
          hideZero
          labelOffset={15}
          tickLabelProps={() => ({
            fill: '#aaa',
            textAnchor: 'middle',
            fontSize: 10,
            fontFamily: 'Arial',
            dy: '-0.5em',
          })}
          numTicks={20}
          label="Time (s)"
          scale={xScale}
          tickComponent={({ formattedValue, ...tickProps }) => (
            <text {...tickProps}>{formattedValue}</text>
          )}
        />
      </Group>
    </svg>
  )
}

export default TimelineGraph
