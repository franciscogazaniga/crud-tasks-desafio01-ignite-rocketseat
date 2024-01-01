import { randomUUID } from 'node:crypto'
import { Database } from "../database.js"
import { buildRoutePath } from "../utils/build-route-path.js"
import { processFile } from "../utils/import-csv.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const { title, description } = req.body
      const todayDate = new Date()

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: todayDate,
        updated_at: todayDate,
      }
  
      database.insert('tasks', task)
  
      return res.writeHead(201).end()
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks-import'),
    handler: async (req, res) => {
      const tasksFile = await processFile()
      const todayDate = new Date()

      if(tasksFile) {
        let taskFile = 1
      
        while(taskFile < (await tasksFile).length) {
          const [ title, description ] = tasksFile[taskFile]

          const task = {
            id: randomUUID(),
            title: title,
            description: description,
            completed_at: null,
            created_at: todayDate,
            updated_at: todayDate,
          }
      
          database.insert('tasks', task)
      
          taskFile++
        }
      }

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const {title, description} = req.body

      const todayDate = new Date()

      database.update('tasks', id, {
        title,
        description,
        updated_at: todayDate
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const todayDate = new Date()

      database.complete('tasks', id, {
        completed_at: todayDate,
      })

      return res.writeHead(204).end()
    }
  }
]