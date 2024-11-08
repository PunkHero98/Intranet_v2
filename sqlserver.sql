---Table USER-----
CREATE TABLE users(
    id_user nvarchar(30) primary key not null,
	username nvarchar(30) not null unique,
	fullname nvarchar(50) not null,
	email nvarchar(100) not null unique,
	user_password nvarchar(50) not null,
	user_role nvarchar(10) not null,
	department nvarchar(100) not null,
	position nvarchar(50) not null,
	user_working_site nvarchar(20) not null,
	user_address nvarchar(50) not null,
	office_phone_number nvarchar(20) not null,
	isActived bit not null
)

---Table ROLE-----
CREATE TABLE roles (
    id_role int primary key not null,
	role nvarchar(30) not null unique,
	view_website bit not null,
	post_content bit not null,
	manage_website bit not null
)

---Table CONTENT-----
CREATE TABLE contents (
    id_content int identity(1,1) primary key not null,
	title nvarchar(100) not null,
	content nvarchar(max) not null,
	content_image nvarchar(max) not null,
	poster nvarchar(40) not null,
	date_time datetime2 not null,
	last_updated datetime2 null,
	deleted bit not null,
	poster_site nvarchar(20) not null	
) 
---Table VERIFICATION-----
CREATE TABLE vertification (
    id_vertifi int primary key not null,
	user_email nvarchar(100) not null,
	email_vertification bit not null,
	code_sending_status bit not null,
	username nvarchar(30) not null,
) 

---Table SESSION-----
CREATE TABLE session (
    id_session nvarchar(100) primary key not null,
	id_user nvarchar(30) not null
) 

---Table ABOUT_USER-----
CREATE TABLE about_user (
    id_about int primary key not null,
	username nvarchar(30) not null unique,
	question1 nvarchar(max) not null,
	question2 nvarchar(max) not null,
	question3 nvarchar(max) not null,
	question4 nvarchar(max) not null,
) 