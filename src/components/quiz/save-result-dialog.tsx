import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface SaveResultDialogProps {
  saveResultFn: (firstName: string, lastName: string, email: string) => Promise<void>
}

export function SaveResultDialog({ saveResultFn }: SaveResultDialogProps) {
  const router = useRouter()
  const { slug: quizSlug } = useParams<{ slug: string }>()
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [buttonText, setButtonText] = useState('Save to Leaderboard')
  const [error, setError] = useState('')

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0 && email.includes('@')

  const handleSave = async () => {
    if (!isValid) return

    setButtonText('Saving...')
    setError('')

    try {
      await saveResultFn(firstName.trim(), lastName.trim(), email.trim())
      setButtonText('Saved! Redirecting to leaderboard...')
      router.push(`/quiz/${quizSlug}/leaderboard`)
      setTimeout(() => {
        setOpen(false)
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error saving, sorry'
      if (message.includes('quiz_results_unique_email_per_quiz')) {
        setError('You already have a result saved for this quiz.')
      } else {
        setError(message)
      }
      setButtonText('Save to Leaderboard')
      console.error('Error saving quiz result: ', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpen(true)
          }}
          variant="outline"
          className="font-bold"
        >
          Save to Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save to Leaderboard</DialogTitle>
          <DialogDescription>
            So you can brag to your friends. Only your first name and last initial will be shown on
            the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              placeholder="e.g. John"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              placeholder="e.g. Smith"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="col-span-3"
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Your email is only used to ensure one entry per person per quiz. It is not displayed on
            the leaderboard.
          </p>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={!isValid}
            onClick={handleSave}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
