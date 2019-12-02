const { routing, json } = require('dragonrend')

const { authenticate } = require('../lib/utils')
const { Article } = require('../models')

const {
  POST, GET, PUT, DELETE
} = module.exports = routing({ prefix: '/articles' })

POST('/', authenticate, async ctx => {
  const { body } = ctx.request.body
  const user = ctx.user.id
  const article = await new Article({ body, user }).save()
  return json(201, article)
})

GET('/', async ctx => {
  const { query } = ctx.request
  const { skip, limit } = query
  delete query.skip
  delete query.limit
  const headers = { 'x-total-count': await Article.countDocuments(query) }
  const articles = await Article
    .find(query)
    .sort({ createdDate: -1 })
    .skip(+skip)
    .limit(+limit)
  return json(200, headers, articles)
})

GET('/:id', async ctx => {
  const article = await Article.findById(ctx.request.params.id)
  return article ?
    json(article) :
    json(404, { error: 'Article has not been found' })
})

PUT('/', authenticate, async ctx => {
  const { _id, body } = ctx.request.body
  const user = ctx.user.id
  const article = await Article.findOneAndUpdate(
    { _id, user },
    { $set: { body } },
    { new: true }
  )
  return json(article)
})

DELETE('/:_id', authenticate, async ctx => {
  await Article.findOneAndRemove({
    _id: ctx.request.params._id,
    user: ctx.user.id
  })
  return json({ message: 'Article has been deleted' })
})
