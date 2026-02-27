export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 dark:text-gray-300">About</h1>
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
        <strong>Support Portal</strong> is a full-featured support ticket management platform built with React and TypeScript. <br />
        It lets teams create, assign, and track support tickets through their entire lifecycle, from submission to resolution, with
        threaded conversations, priority tracking, and real-time status updates.
      </p>
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed mt-3">
        Role-based dashboards give <strong>Managers</strong> analytics like priority matrices and team workload charts,
        <strong> Support</strong> agents a focused queue of assigned tickets, and <strong>Users</strong> a simple view of
        their open requests, each tailored to get the right information to the right people.
      </p>
    </div>
  );
}
