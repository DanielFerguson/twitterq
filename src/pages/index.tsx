import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

import { trpc } from "../utils/trpc";
import { Fragment, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Stats from "../components/Stats";

import { Dialog, Transition } from "@headlessui/react";
import { Question } from "@prisma/client";

function secondsToStr(seconds: number) {
  function numberEnding(number: number) {
    return number > 1 ? "s" : "";
  }

  let temp = Math.floor(seconds);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  const secondsFormatted = temp % 60;
  if (secondsFormatted) {
    return secondsFormatted + " second" + numberEnding(secondsFormatted);
  }
  return "less than a second";
}

const Home: NextPage = () => {
  const askQuestion = trpc.questions.ask.useMutation();
  const questions = trpc.questions.getAll.useQuery();
  const statistics = trpc.stats.getAll.useQuery();
  const notifications = trpc.notifications.register.useMutation();

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const [emailAddress, setEmailAddress] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);

  const [query, setQuery] = useState(
    "@thedannyferg why did you make this platform?"
  );

  const submitQuestion = async (query: string) => {
    // Check that the query is not empty
    if (query.length === 0) {
      toast.error("Please enter a question!");
      return;
    }

    // Check that there is a twitter handle present
    if (!query.includes("@")) {
      toast.error("Please include a twitter handle!");
      return;
    }

    // Check that the query is not too long
    if (query.length > 140) {
      toast.error("Please keep your question under 140 characters!");
      return;
    }

    const question = await toast.promise(
      askQuestion.mutateAsync({ question: query }),
      {
        loading: "Asking the question...",
        success: "We've asked them!",
        error: "Ahh.. whoops! Something went wrong.",
      }
    );

    // If the question was asked successfully, open the modal
    if (question) {
      setQuestion(question);
      setOpen(true);
    }

    // Clear the query
    setQuery("");
  };

  const registerNotificationIntent = async () => {
    // Check that emailAddress is not empty
    if (emailAddress.length === 0) {
      toast.error("Please enter an email address!");
      return;
    }

    // Check that emailAddress is valid
    if (!emailAddress.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // Check that a question has been asked
    if (!question) {
      toast.error("Please ask a question first!");
      return;
    }

    await toast.promise(
      notifications.mutateAsync({ emailAddress, questionId: question.id }),
      {
        loading: "One moment, please...",
        success: "We'll notify you!",
        error: "Ahh.. whoops! Something went wrong.",
      }
    );

    // Close the modal
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>
          TwitterQ - Ask questions, get answers from your favourite Twitter
          users.
        </title>
        <meta
          name="description"
          content="Have you always wanted to learn more about the incredible community around the world? Find answers here!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster />

      {/* Follow Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
                      <span className="text-xl">👋</span>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        We&apos;ll keep you in the loop!
                      </Dialog.Title>
                      <div className="mt-4 grid gap-y-4">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="you@example.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                        />

                        <p className="text-sm text-gray-500">
                          If you want, we can send you an email once we get a
                          response to your question. We promise we&apos;ll never
                          spam you.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={() => registerNotificationIntent()}
                    >
                      Let me know!
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Nah, I&apos;m good.
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="mx-auto max-w-7xl py-8 px-8 md:px-12">
        {/* Nav Bar */}
        <NavBar />

        {/* Main Content */}
        <div className="mt-20 flex flex-col items-center justify-center gap-12 md:mt-32">
          {/* Title */}
          <h1 className="text-center text-5xl font-bold dark:text-white md:text-6xl">
            Get the answers you&apos;ve <br className="hidden md:block" />{" "}
            always wanted.
          </h1>

          {/* Input */}
          <div className="relative w-full md:max-w-md">
            <div className="h-[9em] overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <textarea
                rows={3}
                className="block w-full resize-none border-0 py-3 focus:ring-0 dark:bg-gray-900 dark:text-gray-50 sm:text-sm"
                placeholder="Ask your favourite Twitter user a question!"
                value={query}
                maxLength={140}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitQuestion(query);
                  }
                }}
              />
            </div>

            {/* Stats */}
            <div className="absolute bottom-0 right-0 mt-6 flex h-12 py-1.5 pr-1.5">
              <div className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                {query.length} / 140
              </div>
            </div>
          </div>

          <div className="relative -my-6 w-40">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">Or</span>
            </div>
          </div>

          {/* See all responses for... */}
          <div className="flex items-center justify-center">
            <div className="block pr-1 text-sm font-medium text-gray-700">
              See all questions and answers for...
            </div>
            <div>
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.location.href = `/user/${
                      (e.target as HTMLInputElement).value
                    }`;
                  }
                }}
                className="block w-full rounded-md border-none placeholder:text-gray-300 focus:border-indigo-500 focus:shadow-sm focus:ring-indigo-500 sm:text-sm"
                placeholder="@thedannyferg"
              />
            </div>
          </div>
        </div>

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
                  : "",
              },
              {
                prompt: "Avg Response Time",
                value: statistics.data?.averageResponseTime
                  ? secondsToStr(statistics.data?.averageResponseTime)
                  : "",
              },
            ]}
          />
        </div>

        {/* Existing questions */}
        <div className="mt-12 columns-1 gap-6 space-y-6 md:mt-24 md:columns-4">
          {questions.data?.map((question) => (
            <div
              id={question.id}
              key={question.id}
              className="break-inside-avoid rounded border border-gray-300 p-6 text-lg leading-8 shadow-lg dark:border-gray-600 dark:bg-slate-800 dark:text-slate-50"
              dangerouslySetInnerHTML={{
                __html: question.content.replace(
                  `@${question.recipent.username}`,
                  `<a href="/user/${question.recipent.username}" class="text-blue-500 dark:text-blue-400 dark:hover:text-blue-600">
                    <img
                      src="${question.recipent.profileImageUrl}"
                      alt="Profile Image"
                      class="h-6 w-6 inline rounded-full"
                    />
                    @${question.recipent.username}
                  </a>`
                ),
              }}
            />
          ))}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
