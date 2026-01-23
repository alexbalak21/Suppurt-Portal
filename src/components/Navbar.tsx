import {Link, useLocation} from "react-router-dom"

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}

export default function Navbar() {
  const location = useLocation()

  const navigation = [
    {name: "Home", href: "/"},
    {name: "About", href: "/about"},
    {name: "API Demo", href: "/demo"},
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <img alt="Company logo" src="/favicon.svg" className="h-8 w-auto" />
          </div>

          {/* Nav links */}
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={classNames(
                  isActive(item.href) ? "text-indigo-600 font-semibold border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-800",
                  "px-3 py-2 text-sm font-medium transition-colors",
                )}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth links */}
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              Login
            </Link>
            <Link to="/register" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
