import { Question, TwitterAccount } from "@prisma/client";

interface QuestionProps {
  questions: Array<
    Question & {
      recipent: TwitterAccount;
    }
  >;
}

const Questions = ({ questions }: QuestionProps) => {
  return (
    <div className="columns-1 gap-6 space-y-6 md:columns-4">
      {questions.map((question) => (
        <div
          id={question.id}
          key={question.id}
          className="break-inside-avoid rounded border border-gray-300 p-6 text-lg leading-8 shadow-lg dark:border-gray-600 dark:bg-slate-800 dark:text-slate-50"
          dangerouslySetInnerHTML={{
            __html: question.content.replace(
              `@${question.recipent.username}`,
              `<a href="/user/${
                question.recipent.username
              }" class="text-blue-500 dark:text-blue-400 dark:hover:text-blue-600">
                    <img
                        src="${question.recipent.profileImageUrl.replace(
                          "_normal",
                          "_bigger"
                        )}"
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
  );
};

export default Questions;
