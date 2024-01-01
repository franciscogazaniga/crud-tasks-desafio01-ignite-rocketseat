import fs from "node:fs/promises"

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist();
    }
  }
  
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const completed_at = this.#database[table][rowIndex].completed_at
    const created_at = this.#database[table][rowIndex].created_at

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {id, completed_at, created_at, ...data}
      this.#persist();
    }
  }

  complete(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    // const title = this.#database[table][rowIndex].title
    // const description = this.#database[table][rowIndex].description
    // const created_at = this.#database[table][rowIndex].created_at
    // const updated_at = this.#database[table][rowIndex].updated_at

    const { title, description, created_at, updated_at } = this.#database[table][rowIndex]

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {id, title, description, created_at, updated_at, ...data}
      this.#persist();
    }
  }
}