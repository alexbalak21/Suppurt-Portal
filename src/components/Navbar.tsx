import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react"
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline"
import {useMemo} from "react"
import {Link, useLocation} from "react-router-dom"
import {useRole} from "@features/auth/useRole"
import UserMenu from "./UserMenu"

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}

interface NavbarProps {
  user?: {name: string; email: string; profileImage?: string | null} | null
}

type NavLink = {
  name: string
  href: string
  show: boolean
}

export default function Navbar({user}: NavbarProps) {
  const location = useLocation();

  const {isUser, isSupport, isAdmin, isVisitor, isManager, activeRole} = useRole();
  console.log('[Navbar] user:', user, 'activeRole:', activeRole, {isUser, isSupport, isAdmin, isVisitor, isManager});

  const navLinks: NavLink[] = useMemo(
    () => [
      // {name: "Home", href: "/", show: true},
      {name: "About", href: "/about", show: isVisitor},
      // {name: "API Demo", href: "/demo", show: isUser || isSupport || isAdmin || isManager},
      {name: "Create Ticket", href: "/create-ticket", show: isUser || isSupport || isAdmin || isManager},
      {name: "My Tickets", href: "/ticket-list", show: isUser},
      {name: "My Profile", href: "/user/profile", show: isUser},
      {name: "Dashboard", href: "/user/dashboard", show: isUser},
      {name: "Support Dashboard", href: "/support/dashboard", show: isSupport},
      {name: "All Tickets", href: "/support/tickets", show: isSupport},
      {name: "Manager Dashboard", href: "/manager/dashboard", show: isManager},
      {name: "All Tickets", href: "/ticket-list", show: isManager},
      {name: "Manage Users", href: "/admin/users", show: isAdmin},
      {name: "Admin Settings", href: "/admin/settings", show: isAdmin},
    ],
    [isAdmin, isSupport, isUser, isVisitor, isManager],
  )

  const visibleNavLinks = useMemo(() => navLinks.filter(link => link.show), [navLinks])

  const isActive = (path: string) => location.pathname === path;

  return (
    <Disclosure
      as="nav"
      aria-label="Main navigation"
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-200 dark:after:bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-black focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500 dark:hover:bg-gray-800 dark:hover:text-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + Desktop nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Company logo" src="/favicon.svg" className="h-8 w-auto dark:invert" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 h-16">
                {visibleNavLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={classNames(
                      isActive(link.href)
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold border-b-3 border-indigo-600 dark:border-indigo-400"
                        : "text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 border-transparent",
                      "flex items-center h-full px-3 text-sm font-medium border-b-2 transition-colors",
                    )}>
                    {/* If you want to add icons, add an 'icon' property to navLinks and render here */}
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                  Login
                </Link>
                {/* <Link to="/register" className="block text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                  Sign up
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 pt-2 pb-3">
          {visibleNavLinks.map(link => (
            <DisclosureButton
              key={link.name}
              as={Link}
              to={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={classNames(
                isActive(link.href)
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-gray-50 dark:bg-gray-800 border-l-4 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-l-4 hover:border-indigo-600 dark:hover:border-indigo-400",
                "flex items-center px-3 py-2 text-base font-medium transition-colors w-full",
              )}>
              {/* If you want to add icons, add an 'icon' property to navLinks and render here */}
              {link.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
