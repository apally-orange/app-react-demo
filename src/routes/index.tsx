import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute('/')({
  component: Index,
});


function Index() {
  return (
    <div >
      <h1>Dashbord</h1>
      <Link to='/posts'>Posts</Link>
    </div>
  );
}