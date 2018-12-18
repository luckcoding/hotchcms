import React from 'react'
import A from 'components/A'

export default () => (
  <div style={{padding: '30px 20px', fontSize: '16px'}}>
    Please <A href='/login' style={{textDecoration: 'underline', color: theme.default}}>sign in</A> first.
  </div>
)
