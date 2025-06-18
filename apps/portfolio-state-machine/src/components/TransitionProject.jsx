import React, { useState } from 'react'
import { ProjectState } from '../portfolioLogic'

export default function TransitionProject({ projects, onTransition }) {
  const [selected, setSelected] = useState('')
  const [state, setState] = useState(ProjectState.PROPOSAL)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selected) return
    onTransition(selected, state)
  }

  return (
    <form onSubmit={handleSubmit} className="transition-form">
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Select project</option>
        {projects.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
      <select value={state} onChange={(e) => setState(e.target.value)}>
        {Object.values(ProjectState).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button type="submit">Transition</button>
    </form>
  )
}
