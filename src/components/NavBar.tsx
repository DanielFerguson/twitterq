import Link from "next/link";

const NavBar = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <Link href="/">
        <h1 className="text-2xl font-bold dark:text-gray-50">TwitterQ</h1>
      </Link>

      {/* Actions */}
      {/* <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in <span className="ml-2">🦜</span>
            </button> */}
    </div>
  );
};

export default NavBar;
