import fetch from 'node-fetch'

export interface Student {
  firstname: string
  lastname: string
  email: string
  passwordhash: string
  dateregistered: Date
  university: string
  matericulationnumber: number
}

export interface Page {
  title: string
  description: string
  datecreated: Date
}

export interface Post {
  title: string
  content: string
  datecreated: Date
}

export function getStudents(): Promise<Student[]> {
  return fetch('http://my.api.mockaroo.com/student.json?key=0ef109b0')
    .then((res: any) => res.json())
    .then((res: any) => {
      return res as Student[]
    })
}

export function getPage(): Promise<Page[]> {
  return fetch('http://my.api.mockaroo.com/page.json?key=0ef109b0')
    .then((res: any) => res.json())
    .then((res: any) => {
      return res as Page[]
    })
}

export function getPost(): Promise<Post[]> {
  return fetch('http://my.api.mockaroo.com/post.json?key=0ef109b0')
    .then((res: any) => res.json())
    .then((res: any) => {
      return res as Post[]
    })
}
