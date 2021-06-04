import mysql from 'mysql'

export const db = mysql.createConnection({
  host: 'mariadb',
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: 'imse',
  multipleStatements: true
})

export const addAccount = 'insert into Account (Name, Email, Password_hash, Date_registered) values (?, ?, ?, ?);'

export const addStudent =
  'insert into Student (StudentID, University, Matriculation_number) values (last_insert_id(), ?, ?);'

export const addRandomPage =
  'insert into Page (StudentID, Title, Description, Date_created) values ((select StudentID from Student order by rand() limit 1), ?, ?, ?);'

export const addRandomPost =
  'set @studentID = (select StudentID from Page order by rand() limit 1); ' +
  'insert into Post (StudentID, Page_Title, Title, Content, Date_created) values (@studentID, (select Title from Page where StudentID = @studentID order by rand() limit 1), ?, ?, ?);'

export const addRandomIsFriendsWith =
  'set @studentID = (select StudentID from Page order by rand() limit 1); ' +
  'insert into follows (StudentID, Friend_StudentID) values (@studentID, (select StudentID from Student where StudentID != @studentID order by rand() limit 1));'
