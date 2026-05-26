import { Router } from 'express'
import { InviteChoice } from '../models/InviteChoice.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const choices = await InviteChoice.find().sort({ createdAt: -1 })
    res.json(choices)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const choice = await InviteChoice.findById(req.params.id)

    if (!choice) {
      return res.status(404).json({ message: 'Choice not found.' })
    }

    res.json(choice)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const choice = await InviteChoice.create(req.body)
    res.status(201).json(choice)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const choice = await InviteChoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!choice) {
      return res.status(404).json({ message: 'Choice not found.' })
    }

    res.json(choice)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const choice = await InviteChoice.findByIdAndDelete(req.params.id)

    if (!choice) {
      return res.status(404).json({ message: 'Choice not found.' })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

router.delete('/', async (_req, res, next) => {
  try {
    await InviteChoice.deleteMany({})
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
