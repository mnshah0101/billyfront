import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage, BotMessage, SpinnerMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
}

export function ChatPanel({ id, title, input, setInput }: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [textMessages, setTextMessages] = React.useState<Array<Object>>([])

  async function submitUserMessage(value: string) {
    // Optimistically add bot message UI
    let spinner_id = nanoid()
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: spinner_id,
        display: <SpinnerMessage />
      }
    ])
    let chat_history = JSON.stringify(textMessages)

    // Get response from AI
  const response = await fetch(`http://127.0.0.1:8000/chat?question=${value}&chat_history=${chat_history}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }    })

    const responseMessage = await response.json()

    const output = responseMessage.response.output

    setMessages(currentMessages => currentMessages.filter(message => message.id !== spinner_id))
    setTextMessages([...textMessages, {"user" : value}, {"assistant" : output}])
    

    return {
      id: nanoid(),
      display: <BotMessage content={output}></BotMessage>
    }
  }

  const exampleMessages = [
    {
      heading: "What is Zach Edey's",
      subheading: 'max points this season?',
      message: `What is Zach Edey's max points this season?`
    },
    {
      heading: 'How has Duke done against',
      subheading: 'the spread in the last 5 games?',
      message: 'How has Duke done against the spread in the last 5 games?'
    },
    {
      heading: 'How has North Carolina',
      subheading: 'done against Virginia?',
      message: `How has North Carolina done against Virginia?`
    },
    {
      heading: 'What do experts say about',
      subheading: `Purdue's chances in March Madness?`,
      message: `What do experts say about Purdue's chances in March Madness?`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
