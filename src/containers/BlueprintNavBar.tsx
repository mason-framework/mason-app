import React from 'react'
import { Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { ReduxState } from 'store/types'
import { getBreadcrumbs } from 'store/blueprint/selectors'

interface Props {
  breadcrumbs: Array<string>
}


const BlueprintNavBar = ({ breadcrumbs }: Props) => (
  <Breadcrumb style={{ background: '#202020', padding: '15px 8px 5px 8px', borderBottom: '1px solid #0c0c0c' }}>
    {breadcrumbs.map((breadcrumb) => (
      <Breadcrumb.Item key={breadcrumb}>{breadcrumb}</Breadcrumb.Item>
    ))}
  </Breadcrumb>
)

const selector = createStructuredSelector<ReduxState, Props>({
  breadcrumbs: getBreadcrumbs,
})

export default connect(selector)(BlueprintNavBar)
