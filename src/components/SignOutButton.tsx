'use client'

import { ButtonHTMLAttributes, FC, useState } from "react"
import Button from "./ui/Button"
import { set } from "zod"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { Loader2, LogOut } from "lucide-react"
interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false)

  
  return (
    <Button {...props} variant='ghost' onClick={async () => {
      setIsSigningOut(true)
      try {
        await signOut()
      } catch (error) {
        toast.error('There was a problem signing out')
      } finally {
        setIsSigningOut(false)
      }
    }}>
      {isSigningOut ? (
        <Loader2 className='animate-spin g-4 w-4' />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  )
}