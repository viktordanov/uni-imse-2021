const selectLastInsertID = 'select last_insert_id() as id;'

const addRandomPage =
  'insert into Page (StudentID, Title, Description, Date_created) values ((select StudentID from Student order by rand() limit 1), ?, ?, ?);'

const addRandomPost =
  'set @studentID = (select StudentID from Page order by rand() limit 1); ' +
  'insert into Post (StudentID, Page_Title, Title, Content, Date_created) values (@studentID, (select Title from Page where StudentID = @studentID order by rand() limit 1), ?, ?, ?);'

const addRandomFollows =
  'set @studentID = (select StudentID from Page order by rand() limit 1); ' +
  'insert into follows (StudentID, Friend_StudentID) values (@studentID, (select StudentID from Student where StudentID != @studentID order by rand() limit 1));'

const addRandomLikes = `set @studentID = (select StudentID from Post order by rand() limit 1);
  set @pageTitle = (select Page_Title from Post where StudentID = @studentID order by rand() limit 1);
  set @postTitle = (select Title from Post where StudentID = @studentID and Page_Title = @pageTitle order by rand() limit 1);
  insert into likes (StudentID, Post_StudentID, Post_Page_Title, Post_Title) values ((select StudentID from Student where StudentID != @studentID order by rand() limit 1), @studentID, @pageTitle, @postTitle);`

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

const addStudentIDLastInserted =
  'insert into Student (StudentID, University, Matriculation_number) values (last_insert_id(), ?, ?);'

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

const getFollowing =
  'select s.StudentID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, s.University as university, s.Matriculation_number as matNumber ' +
  'from Student s inner join Account a on s.StudentID = a.AccountID ' +
  'inner join follows f on f.Friend_StudentID = s.StudentID ' +
  'where f.StudentID = ?;'

const addFollow = 'insert into follows (StudentID, Friend_StudentID) values (?, ?);'

const removeFollow = 'delete from follows where StudentID = ? and Friend_StudentID = ?;'

const getLikedPostsOf =
  'select Title as title, Content as content, Date_created as dateCreated ' +
  'from Post p inner join likes l on p.StudentID = l.Post_StudentID and p.Page_Title = l.Post_Page_Title and p.Title = l.Post_Title ' +
  'where l.StudentID = ?;'

const addLike = 'insert into likes (StudentID, Post_StudentID, Post_Page_Title, Post_Title) values (?, ?, ?, ?);'

const removeLike =
  'delete from likes where StudentID = ? and Post_StudentID = ? and Post_Page_Title = ? and Post_Title = ?;'

const addAdmin = 'insert into Admin (AdminID, Address, SSN) values (last_insert_id(), ?, ?);'

const removeAdmin = 'delete from Admin where AdminID = ?;'

const getAdminById =
  'select a.AccountID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, ad.Address as address, ad.SSN as ssn ' +
  'from Admin ad inner join Account a on ad.AdminID = a.AccountID ' +
  'where ad.AdminID = ?;'

const updateAdmin = 'update Admin set Address = ?, SSN = ? where AdminID = ?;'

const getAllAdmins =
  'select a.AccountID as id, a.Name as name, a.EMail as email, a.Password_Hash as passwordHash, a.Date_registered as dateRegistered, ad.Address as address, ad.SSN as ssn ' +
  'from Admin ad inner join Account a on ad.AdminID = a.AccountID;'

const addEvent = 'insert into Event (Name, Description, Duration, Date) values (?, ?, ?, ?);'

const removeEvent = 'delete from Event where EventID = ?;'

const getEventById =
  'select EventID as id, Name as name, Description as description, Duration as duration, Date as date from Event where EventID = ?;'

const getEventByName =
  'select EventID as id, Name as name, Description as description, Duration as duration, Date as date from Event where Name = ?;'

const updateEvent = 'update Event set Name = ?, Description = ?, Duration = ?, Date = ? where EventID = ?;'

const getAllEvents =
  'select EventID as id, Name as name, Description as description, Duration as duration, Date as date from Event;'

const getAllPagesOf =
  'select Title as title, Description as description, Date_created as dateCreated from Page where StudentID = ?;'

const getAllPostsOf =
  'select Title as title, Content as content, Date_created as dateCreated from Post where StudentID = ? and Page_Title = ?;'

const getAllEventsCreatedBy =
  'select EventID as id, Name as name, Description as description, Duration as duration, Date as date from Event where Create_Admin_ID = ?;'

const getAccountByEmail =
  'select AccountID as id, Name as name, EMail as email, Password_Hash as passwordHash, Date_registered as dateRegistered from Account where EMail = ?;'

const getReportStudentActivity = `
  select a.Name as studentName
    , count(p.Title) as sumPages
    , (select count(p1.Title) from Post p1 where p1.StudentID = s.StudentID and p1.Page_Title = p.Title) as sumPosts 
    , (select count(l.StudentID) from likes l where l.StudentID = s.StudentID) as likedPosts 
  from Student s 
  inner join Account a on s.StudentID = a.AccountID 
  inner join Page p on p.StudentID = s.StudentID 
  where a.Date_registered >= date_sub(now(), interval ? week) 
  group by s.StudentID, a.Name 
  order by a.Name;`

const getReportFamousStudents = `
  select p.Page_Title as pageTitle
    , p.Title as title
    , (select a.Name from Student s 
      inner join Account a on a.AccountID = s.StudentID 
      inner join Page pp on pp.StudentID = s.StudentID
      inner join Post ppp on ppp.Page_Title = pp.Title
      where pp.Title = p.Page_Title and ppp.Title = p.Title limit 1) as studentName
    , (select count(*) from likes l
      inner join Student s on l.StudentID = s.StudentID
      where l.Post_Title = p.Title and l.Post_Page_Title = p.Page_Title) as likes
    , (select count(f.StudentID) from follows f where f.Friend_StudentID = p.StudentID) as studentFollowers
  from Post p
  where p.Title like ?
  group by p.Page_Title;`

export const SQLQueries = {
  selectLastInsertID,
  addPage,
  removePage,
  getPageByTitle,
  updatePage,
  addPost,
  removePost,
  getPostByTitle,
  updatePost,
  getStudentLikesOfPost,
  addStudentIDLastInserted,
  addAccount,
  removeStudent,
  getStudentById,
  updateStudent,
  updateAccount,
  getAllStudents,
  getFollowersOf,
  getFollowing,
  addFollow,
  removeFollow,
  getLikedPostsOf,
  addLike,
  removeLike,
  addAdmin,
  addRandomPage,
  addRandomPost,
  removeAdmin,
  getAdminById,
  updateAdmin,
  getAllAdmins,
  addEvent,
  removeEvent,
  getEventById,
  getEventByName,
  updateEvent,
  getAllEvents,
  getAllPagesOf,
  getAllPostsOf,
  getAllEventsCreatedBy,
  getAccountByEmail,
  getReportStudentActivity,
  getReportFamousStudents,
  addRandomFollows,
  addRandomLikes
}
