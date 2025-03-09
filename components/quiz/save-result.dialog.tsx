import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@root/components/dialog'

import { Button } from '../button'
import { Input } from '../input'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'

const wait = () => new Promise((resolve) => setTimeout(resolve, 2000))
  
  interface SaveResultDialogProps {
    saveResultFn: (name: string) => Promise<void>
  }
  
  export function SaveResultDialog({ saveResultFn }: SaveResultDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [buttonText, setButtonText] = useState('Save to Leaderboard')
  
    const handleSave = async () => {
      setButtonText('Saving...')
  
      try {
        await saveResultFn(name)
      } catch (error) {
        setButtonText('Error saving, sorry')
        console.error('Error saving quiz result: ', error)
      }
  
      setTimeout(() => {
        setOpen(false)
      }, 1000)
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setOpen(true)
            }}
            variant="outline"
          >
            Save to Leaderboard
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save to Leaderboard</DialogTitle>
            <DialogDescription>
              So you can brag to your friends. Initials must be three characters or less
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Initials
              </Label>
              <Input
                onChange={(e) => {
                  setName(e.target.value)
                }}
                id="name"
                placeholder="e.g. JFK"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-emerald-500"
              onClick={async () => {
                handleSave()
              }}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }