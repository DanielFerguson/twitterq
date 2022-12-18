import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Link from "next/link";
import Stats from "../../components/Stats";
import { secondsToStr } from "../../utils/helpers";
import Questions from "../../components/Questions";

const Page: NextPage = () => {
  const router = useRouter();
  const username = router.query.username?.toString().replace("@", "");

  if (typeof username !== "string" || username.length === 0 || !username) {
    return null;
  }

  const statistics = trpc.stats.getForUser.useQuery({ username });
  const questions = trpc.questions.getForUser.useQuery({ username });
  const otherAccounts = trpc.twitterUsers.getOtherAccounts.useQuery({
    notUser: username,
  });

  // Get the user's profile
  const user = trpc.twitterUsers.get.useQuery({ username });

  return (
    <div>
      <Head>
        <title>{user.data?.friendlyName} - TwitterQ</title>
        <meta name="description" content={user.data?.description} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>

      <main className="mx-auto max-w-7xl py-8 px-8 md:px-12">
        <NavBar />

        {/* Profile Details */}
        <div className="mt-20 flex flex-col items-center justify-center gap-12 md:mt-32">
          <div className="flex items-center gap-12">
            <img
              src={user.data?.profileImageUrl.replace("_normal", "")}
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

        {/* CTA to ask a question, if this user doesn't have any questions */}
        {user.data?.questions.length === 0 && (
          <div>
            <div className="mt-20 flex flex-col items-center justify-center md:mt-32">
              <h2 className="text-2xl font-bold">
                {user.data?.friendlyName} hasn&apos;t asked any questions yet!
              </h2>
              <p className="mt-2 text-lg leading-8 tracking-wide text-gray-800">
                Ask them a question by clicking the button below!
              </p>

              <Link href={`/?ask=${user.data?.username}`}>
                <button className="mt-6 rounded bg-blue-600 py-2 px-4 font-bold text-white hover:bg-blue-700">
                  Ask @{user.data?.username} a question
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mx-auto mt-12 max-w-4xl md:mt-24">
          <Stats
            stats={[
              {
                prompt: "Questions",
                value: statistics.data?.questionsAsked
                  ? statistics.data?.questionsAsked.toString()
                  : "",
              },
              {
                prompt: "Answers",
                value: statistics.data?.questionsAnswered
                  ? statistics.data?.questionsAnswered.toString()
                  : "0",
              },
              {
                prompt: "Avg Response Time",
                value: statistics.data?.averageResponseTime
                  ? secondsToStr(statistics.data?.averageResponseTime)
                  : "Soon? 👀",
              },
            ]}
          />
        </div>

        {/* Questions & Answers */}
        {questions.data && (
          <div className="mt-12 md:mt-24">
            <Questions questions={questions.data} />
          </div>
        )}

        {/* Ask a question CTA */}
        {user.data?.questions && user.data.questions.length > 0 && (
          <div className="mx-auto mt-12 max-w-7xl text-center md:mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Got a burning question?</span>
              <span className="block">Get answers today!</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href={`/?ask=${username}`}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
                >
                  Ask @{username} a question!
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Other Accounts */}
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
                        src={account.profileImageUrl.replace("_normal", "")}
                        alt=""
                      />
                      <Link
                        href={`/user/${account.username}`}
                        className="space-y-1 text-lg font-medium leading-6"
                      >
                        <h3 className="text-blue-600 hover:text-blue-800">
                          {account.friendlyName}
                        </h3>
                        <p className="text-gray-700">
                          {account.description
                            .replace(/https:\/\/t.co\/\w+/g, "")
                            .slice(0, 100)}
                          {account.description.replace(
                            /https:\/\/t.co\/\w+/g,
                            ""
                          ).length > 100 && "..."}
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
