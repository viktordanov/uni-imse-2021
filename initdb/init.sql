create database if not exists imse;
use imse;
grant all privileges on imse.* to 'imse'@'%';

create table if not exists Account (
      AccountID int not null auto_increment,
      Name varchar(255) not null,
      EMail varchar(255) not null,
      Password_hash binary(64) not null,
      Date_registered datetime not null,
      primary key (AccountID)
);

create table if not exists Admin (
    AdminID int not null,
    Address varchar(255) not null,
    SSN bigint not null,
    primary key (AdminID),
    foreign key (AdminID) references Account(AccountID) on delete cascade
);

create table if not exists Student (
    StudentID int not null,
    University varchar(255) not null,
    Matriculation_number varchar(255) not null,
    primary key (StudentID),
    foreign key (StudentID) references Account(AccountID) on delete cascade
);

create table if not exists Event (
    EventID int not null auto_increment,
    Name varchar(255) not null,
    Description varchar(255) not null,
    Duration datetime not null,
    Date datetime not null,
    Create_AdminID int,
    primary key (EventID),
    foreign key (Create_AdminID) references Admin(AdminID)
);

create table if not exists Page (
    StudentID int not null,
    Title varchar(255) not null,
    Description varchar(255) not null,
    Date_created datetime not null,
    delete_AdminID int,
    primary key (StudentID, Title),
    foreign key (StudentID) references Student(StudentID) on delete cascade
);

create table if not exists Post (
    StudentID int not null,
    Page_Title varchar(255) not null,
    Title varchar(255) not null,
    Content varchar(1000) not null,
    Date_created datetime not null,
    primary key (StudentID, Page_Title, Title),
    foreign key (StudentID, Page_Title) references Page(StudentID, Title) on delete cascade
);

create table if not exists is_friends_with (
    StudentID int not null,
    Friend_StudentID int not null,
    primary key (StudentID, Friend_StudentID),
    foreign key (StudentID) references Student(StudentID) on delete cascade,
    foreign key (Friend_StudentID) references Student(StudentID) on delete cascade
);

create table if not exists participate (
    StudentID int not null,
    EventID int not null,
    primary key (StudentID, EventID),
    foreign key (StudentID) references Student(StudentID) on delete cascade,
    foreign key (EventID) references Event(EventID) on delete cascade
);

create table if not exists likes (
    StudentID int not null,
    Post_StudentID int not null,
    Post_Page_Title varchar(255) not null,
    Post_Title varchar(255) not null,
    primary key (StudentID, Post_StudentID, Post_Page_Title, Post_Title),
    foreign key (StudentID) references Student(StudentID) on delete cascade,
    foreign key (Post_StudentID, Post_Page_Title, Post_Title) references Post(StudentID, Page_Title, Title) on delete cascade
);
