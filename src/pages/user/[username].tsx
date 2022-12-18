import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Link from "next/link";

const Page: NextPage = () => {
  const router = useRouter();
  // Get the username from the URL, and format it to remove any @ symbols
  const username = router.query.username?.toString().replace("@", "");

  if (typeof username !== "string" || username.length === 0 || !username) {
    // TODO: Return an error page
    return null;
  }

  const otherAccounts = trpc.twitterUsers.getOtherAccounts.useQuery({
    notUser: username,
    limit: 6,
  });

  // Get the user's profile
  const user = trpc.twitterUsers.get.useQuery({ username });

  return (
    <div>
      <Head>
        <title>{user.data?.friendlyName} - TwitterQ</title>
        <meta name="description" content={user.data?.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto max-w-7xl py-8 px-8 md:px-12">
        <NavBar />

        {/* Profile Details */}
        <div className="mt-20 flex flex-col items-center justify-center gap-12 md:mt-32">
          <div className="flex items-center gap-12">
            <img
              src={user.data?.profileImageUrl}
              alt={user.data?.friendlyName}
              className="h-56 w-56 rounded-full"
            />
            <div className="max-w-md">
              <h2 className="text-2xl font-bold">{user.data?.friendlyName}</h2>
              <p className="text-gray-600">@{user.data?.username}</p>
              <p className="mt-4 text-lg leading-8 tracking-wide text-gray-800">
                {user.data?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stats? */}

        {/* Questions & Answers */}

        {/* Other Questions */}
        <div className="mx-auto md:mt-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-5 sm:space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Other accounts
              </h2>
              <p className="text-xl text-gray-500">
                Check out other interested accounts that have asked questions!
                Can&apos;t see someone you&apos;re looking for? Ask them to join
                by sending them a question on the home page!
              </p>
            </div>
            <div className="lg:col-span-2">
              <ul
                role="list"
                className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8"
              >
                {otherAccounts.data?.map((account) => (
                  <li key={account.username}>
                    <div className="flex items-center space-x-4 lg:space-x-6">
                      <img
                        className="h-16 w-16 rounded-full lg:h-20 lg:w-20"
                        src={account.profileImageUrl}
                        alt=""
                      />
                      <Link
                        href={`/user/${account.username}`}
                        className="space-y-1 text-lg font-medium leading-6"
                      >
                        <h3 className="text-indigo-600 hover:text-indigo-800">
                          {account.friendlyName}
                        </h3>
                        <p className="text-gray-700">
                          {account.description.slice(0, 100)}
                          {account.description.length > 100 && "..."}
                        </p>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Page;
