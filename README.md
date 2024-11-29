# shaper-nuxt
Simple web application build in Nuxt. Includes user authentication and user-dependent profile pages where users can add and modify shapes. Designed with a modern, minimalist, user-firendly approach.

## Functionality
### Authentication
Users can create new accounts and log into their existing account. All accounts are stored on a PostgreSQL database with encrypted passwords.
### Shape creation and modification
Upon login (or registration), users are prompted into a personal profile page with a canvas. On this canvas, they can add new shapes (currently only circles are supported) and drag them around dynamically. Furthermore, users are able to edit and modify these shapes by right clicking on one of the existing shapes and choosing an option from the context menu. The position and properties of the shapes are stored in a PostgreSQL database, and are fetched whenever a user accesses a profile page.

## Installation
This web application is hosted locally, and not yet deployed on a server. Thus, to use the website, you must follow the following steps:
#### Clone the repository
```bash
git clone https://github.com/davidmrc6/shaper-nuxt.git
```
Then, navigate to the repository.
```
cd shaper-nuxt
```
#### Install dependencies
```bash
npm i
```
#### Initialize database
Since the database is run on a local host and not on the cloud, it must be initialized locally for the website to work as expected.
To initialize the database, log into PostgreSQL locally and create a database called `cm_auth` with a superuser `admin` (with password `admin`). Then, create a `.env` file in the root directory of the project and include this database url:
```.env
DATABASE_URL=postgresql://admin:admin@localhost:5432/cm_auth
```
Alternatively, you can change the username, password, and name of database according to your needs.
```.env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<db_name>
```
For a more in-depth guide to properly setting up the database, refer to [this guide](server/db/DBSETUP.md).
#### Create JWT token
You can create a JWT token and include it in your `.env` file by running the command
```bash
openssl rand -hex 64
```
on your terminal, and then adding
```.env
JWT_SECRET=<your_token_goes_here>
```
inside your `.env` file.
#### Run the development server
```bash
npm run dev
```
Then, navigate to `localhost:3000` on your browser.
## Usage
After initializing the project, you can run it with the command
```bash
npm run dev
```

## Preview
#### Log in page
![Log in page](assets/screenshots/login-page-updated.png)

#### Registration page
![Registration page](assets/screenshots/register-page-updated.png)

#### User profile page
![User profile page](assets/screenshots/canvas-page-updated.png)
![User profile edit](assets/screenshots/canvas-edit-updated.png)

## Developer Notes
The web application still has some issues which would need to be solved for it to be a complete product. The project is still under active development. For change logs and future features, refer to the [change log](CHANGELOG.md).

#### Code Layout
Being the first time I have worked with Nuxt, the code might be inconsistent or not following standard practices at some points (there might also be some redundant code at places). Admittedly, despite the application being functional, there are a few "band-aid solutions" to some problems I came across, which I will fix at some point. Also, the documentation could be improved.

#### Website Layout
The current website layout isn't perfect - the 'profile' and 'add-shape' buttons are in an awkward position (and they don't translate well when using a mobile resolution, as their positioning is absolute.)

#### Performance
The website might currently have some performance issues, likely because of the default CSS layout being used, or because of how some of the code works (not optimally, for example the recursive instantiation of the database).

#### Testing
The project lacks proper testing.
