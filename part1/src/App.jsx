import React from 'react'

// Header component
const Header = ({ courseName }) => <h1>{courseName}</h1>

// Part component
const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

// Content component
const Content = ({ parts }) => {
  return (
    <div>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </div>
  )
}

// Total component
const Total = ({ parts }) => {
  const total = parts[0].exercises + parts[1].exercises + parts[2].exercises
  return <p>Number of exercises {total}</p>
}

// App component
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      { name: 'Fundamentals of React', exercises: 10 },
      { name: 'Using props to pass data', exercises: 7 },
      { name: 'State of a component', exercises: 14 }
    ]
  }

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
