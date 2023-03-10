import { type NextPage } from "next";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";

import { trpc } from "../utils/trpc";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Stats from "../components/Stats";

import { Dialog, Transition } from "@headlessui/react";
import { Question } from "@prisma/client";
import { secondsToStr } from "../utils/helpers";
import Questions from "../components/Questions";
import { NextSeo } from "next-seo";

const Home: NextPage = () => {
  const askQuestion = trpc.questions.ask.useMutation();
  const questions = trpc.questions.getAll.useQuery();
  const statistics = trpc.stats.getAll.useQuery();
  const notifications = trpc.notifications.register.useMutation();

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const [emailAddress, setEmailAddress] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);

  const [query, setQuery] = useState("");

  // Check if ?ask is present in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const askParam = urlParams.get("ask");
    if (askParam) {
      setQuery(`@${askParam.replace("@", "")}, ...`);
    }
  }, []);

  const questionInput = useCallback((inputElement: any) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

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
      <NextSeo
        title="TwitterQ - Ask questions, get answers from your favourite Twitter users."
        description="Have you always wanted to learn more about the incredible community around the world? Find answers here!"
        canonical="https://www.twitterq.app/"
        openGraph={{
          url: "https://www.twitterq.app/og.jpg",
          title: "Ask questions, get answers! TwitterQ",
          description:
            "Have you always wanted to learn more about the incredible community around the world? Find answers here!",
          images: [
            {
              url: "https://www.twitterq.app/og.jpg",
              width: 1200,
              height: 630,
              type: "image/jpeg",
            },
          ],
          siteName: "TwitterQ",
        }}
        twitter={{
          handle: "@thedannyferg",
          site: "@buildwithdan",
          cardType: "summary_large_image",
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "https://www.twitterq.app/favicon.ico",
          },
          {
            rel: "apple-touch-icon",
            href: "https://www.twitterq.app/apple-touch-icon.png",
            sizes: "180x180",
          },
          {
            rel: "icon",
            href: "https://www.twitterq.app/favicon-32x32.png",
            type: "image/png",
          },
          {
            rel: "icon",
            href: "https://www.twitterq.app/favicon-16x16.png",
            type: "image/png",
          },
          {
            rel: "manifest",
            href: "https://twitterq.app/site.webmanifest",
          },
        ]}
      />

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
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                      <span className="text-xl">????</span>
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
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={() => registerNotificationIntent()}
                    >
                      Let me know!
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
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
          <h1 className="font-display mx-auto max-w-4xl text-center text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Get{" "}
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">answers</span>
            </span>{" "}
            for all your questions.
          </h1>

          {/* Input */}
          <div className="relative w-full md:max-w-md">
            <div className="h-[9em] overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <textarea
                rows={3}
                autoFocus
                ref={questionInput}
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
                className="block w-full rounded-md border-none placeholder:text-gray-300 focus:border-blue-500 focus:shadow-sm focus:ring-blue-500 sm:text-sm"
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
        {questions.data && (
          <div className="mt-12 md:mt-24">
            <Questions questions={questions.data} />
          </div>
        )}

        <Footer />
      </main>
    </>
  );
};

export default Home;
