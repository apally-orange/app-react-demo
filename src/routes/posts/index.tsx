import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/')({
  component: Posts,
})

function Posts() {


  return (
    <>
      <h1>Liste des Posts</h1>
      <ul>
        <li>Post 1</li>
        <li>Post 2</li>
        <li>Post 3</li>
      </ul>
    </>
  )
}
