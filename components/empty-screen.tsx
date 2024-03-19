import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Billy Bets!
        </h1>
        <p className="leading-normal text-muted-foreground">
          Billy Bets is your personal sports betting assistant powered by AI. Built by {' '}
          <ExternalLink href="https://megalabs.xyz">MegaLabs.xyz</ExternalLink>
        
        </p>
        <p className="leading-normal text-muted-foreground">
         
          Billy is currently in training. Feel free to ask him your March Madness questions, and hell do his best to help you out.
        </p>
      </div>
    </div>
  )
}
