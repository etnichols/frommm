'use server'

async function getQuiz(slug: string) {
  fetch(`/api/quiz/${slug}`)
    .then((res) => res.json())
    .then((data) => {
      console.log('Quiz: ', data)
    })
    .catch((err) => {
      console.error('Error fetching quiz:', err)
    })
  console.log('Quiz: ', quiz)

  return {
    props: {
      quiz: {},
    },
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  console.dir(params)
  const quiz = await getQuiz(params.slug)
  return (
    <div>
      <div>Page for {params.slug}</div>
      {/* <div>Quiz: {JSON.stringify(quiz)}</div> */}
    </div>
  )
}
