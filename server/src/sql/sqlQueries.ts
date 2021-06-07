const addPage = 'insert into Page (StudentID, Title, Description, Date_created) values (?, ?, ?, ?);'

const removePage = 'delete from Page where StudentID = ? and Title = ?;'

const getPageByTitle =
  'select Title as title, Description as description, Date_created as dateCreated from Page where StudentID = ? and Title = ?;'

const updatePage = 'update Page set Title = ?, Description = ?, Date_created = ? where StudentID = ? and Title = ?;'

const addPost = 'insert into Post (StudentID, Page_Title, Title, Content, Date_created) values (?, ?, ?, ?, ?);'

const removePost = 'delete from Post where StudentID = ? and Page_Title = ? and Title = ?;'

const getPostByTitle =
  'select Title as title, Content as content, Date_created as dateCreated from Post where StudentID = ? and Page_Title = ? and Title = ?;'

const updatePost = 'update Post set Content = ?, Date_created = ? where StudentID = ? and Page_Title = ? and Title = ?;'

const getStudentLikesOfPost =
  'select s.StudentID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, s.University as university, s.Matriculation_number as matNumber ' +
  'from likes l inner join Student s on l.StudentID = s.StudentID ' +
  'inner join Account a on a.AccountID = s.StudentID ' +
  'where l.Post_StudentID = ? and l.Post_Page_Title = ? and l.Post_Title = ?;'

const addAccount = 'insert into Account (Name, Email, Password_hash, Date_registered) values (?, ?, ?, ?);'

const addStudent = 'insert into Student (StudentID, University, Matriculation_number) values (last_insert_id(), ?, ?);'

const removeStudent = 'delete from Student where StudentID = ?;'

const getStudentById =
  'select s.StudentID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, s.University as university, s.Matriculation_number as matNumber ' +
  'from Student s inner join Account a on s.StudentID = a.AccountID ' +
  'where s.StudentID = ?'

const updateStudent = 'update Student set University = ?, Matriculation_number = ? where StudentID = ?;'

const updateAccount =
  'update Account set Name = ?, EMail = ?, Password_hash = ?, Date_registered = ? where AccountID = ?;'

const getAllStudents =
  'select s.StudentID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, s.University as university, s.Matriculation_number as matNumber ' +
  'from Student s inner join Account a on s.StudentID = a.AccountID;'

const getFollowersOf =
  'select s.StudentID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, s.University as university, s.Matriculation_number as matNumber ' +
  'from Student s inner join Account a on s.StudentID = a.AccountID ' +
  'inner join follows f on f.StudentID = s.StudentID ' +
  'where f.Friend_StudentID = ?;'

const addFollow = 'insert into follows (StudentID, Friend_StudentID) values (?, ?);'

const removeFollow = 'delete from follows where StudentID = ? and Friend_StudentID = ?;'

const getLikedPostsOf =
  'select Title as title, Content as content, Date_created as dateCreated ' +
  'from Post p inner join likes l on p.StudentID = l.Post_StudentID and p.Page_Title = l.Post_Page_Title and p.Title = l.Post_Title ' +
  'where l.StudentID = ?;'

const addLike = 'insert into likes (StudentID, Post_StudentID, Post_Page_Title, Post_Title) values (?, ?, ?, ?);'

const removeLike =
  'delete from likes where StudentID = ? and Post_StudentID = ? and Post_Page_Title = ? and Post_Title = ?;'

export const SQLQueries = {
  addPage,
  removePage,
  getPageByTitle,
  updatePage,
  addPost,
  removePost,
  getPostByTitle,
  updatePost,
  getStudentLikesOfPost,
  addStudent,
  addAccount,
  removeStudent,
  getStudentById,
  updateStudent,
  updateAccount,
  getAllStudents,
  getFollowersOf,
  addFollow,
  removeFollow,
  getLikedPostsOf,
  addLike,
  removeLike
}
