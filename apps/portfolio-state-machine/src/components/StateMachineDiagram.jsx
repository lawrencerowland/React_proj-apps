import React from 'react'
import diagram from '../portfolio_state_diag.svg'

export default function StateMachineDiagram() {
  return (
    <div className="state-machine-diagram">
      <img src={diagram} alt="State machine diagram" style={{ maxWidth: '100%' }} />
    </div>
  )
}
