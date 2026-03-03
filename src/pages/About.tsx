export default function About() {
  return (
    <div>
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
        <p>
            <span className="flex items-center gap-2 mt-6 text-gray-700 dark:text-gray-200 text-lg">
              <span className="inline-flex items-center gap-1">
                {/* Spring Boot icon */}
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring Boot" className="w-6 h-6" />
                Spring Boot
              </span> &
              <span className="inline-flex items-center gap-1">
                {/* React icon */}
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-6 h-6" />
                React JS
              </span>
              by <span className="font-bold">Alex Balak</span>
            </span>
        </p>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">Screenshots</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          <div className="flex flex-col items-center w-full md:w-1/3">
            <span className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Manager Dashboard</span>
            <a href="/screenshot/manager_dashboard.jpg" target="_blank" rel="noopener noreferrer" className="w-full">
              <img
                src="/screenshot/manager_dashboard.jpg"
                alt="Dashboard Screenshot"
                className="rounded shadow-md w-full max-w-full border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform duration-200 object-cover"
              />
            </a>
          </div>
          <div className="flex flex-col items-center w-full md:w-1/3 mt-6 md:mt-0">
            <span className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Ticket Details</span>
            <a href="/screenshot/ticket_details.jpg" target="_blank" rel="noopener noreferrer" className="w-full">
              <img
                src="/screenshot/ticket_details.jpg"
                alt="Ticket Detail Screenshot"
                className="rounded shadow-md w-full max-w-full border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform duration-200 object-cover"
              />
            </a>
          </div>
          <div className="flex flex-col items-center w-full md:w-1/3 mt-6 md:mt-0">
            <span className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Ticket List</span>
            <a href="/screenshot/ticket_list.jpg" target="_blank" rel="noopener noreferrer" className="w-full">
              <img
                src="/screenshot/ticket_list.jpg"
                alt="Ticket List Screenshot"
                className="rounded shadow-md w-full max-w-full border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform duration-200 object-cover"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
