import React, { useState } from 'react'

export default function AddProject({ onAddProject }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAddProject(trimmed)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="add-project-form">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
      />
      <button type="submit">Add Project</button>
    </form>
  )
}
