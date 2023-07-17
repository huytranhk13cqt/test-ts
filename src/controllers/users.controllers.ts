import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'tranduchuy182@gmail.com' && password === '123456') {
    res.json({ message: 'login success' })
  }

  return res.status(400).json({
    error: 'email or password is incorrect'
  })
}
