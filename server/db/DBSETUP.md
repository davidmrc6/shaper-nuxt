# Database Setup
In order for the website to work as expected while hosted locally, PostgreSQL must be installed and a database must be configured according to what the program is expected. If you already have `postgresql` installed on your device, follow these steps:
1. Access the PostgreSQL shell
```bash
psql -U postgres
```
2. Create the database (with the name `cm_auth`)
```sql
CREATE DATABASE cm_auth;
```
3. Create admin user
```sql
CREATE USER admin WITH PASSWORD 'admin';
```
4. Grant superuser privileges
```sql
ALTER USER admin WITH SUPERUSER;
```

To verify the changes, you can run:
```sql
\l
```
to list the databases, and
```sql
\du
```
to list all roles. The output should show the `cm_auth` database and the `admin` user with superuser privileges.

Once these steps have been followed, create a `.env` file and add the database URL as specified in project README file.
