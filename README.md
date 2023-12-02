
<a name="readme-top"></a>

# Chat-App

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#deployment">Prerequisites</a></li>
        <li><a href="#editing">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#used-libraries">Used libraries</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
      </ul>
    </li>
  </ol>
</details>

## About The Project
Simple fullstack chat web application written using `Express`, `Socket.IO`, `React`, `TypeScript`, `Sass`, `Docker` and `Nginx`
See below for more information
Some features:
- Create account
- Customize nickname, description and avatar of your profile
- Create chat
- Customize title, password (can be empty) and avatar of your chat
- Join existing chats
- Leave or delete chats
- Chat with people in real-time
- Check profiles of other users

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

### Deployment

`Docker` and `docker-compose` are used for easy deployment
1. Run `docker-compose up` command
2. Visit `localhost:80` in your browser
3. Create account

> [!NOTE]
> There is premade account
> 
> Email: texas@penguins.com
> 
> Password: randomPass

> [!IMPORTANT]
> Database is not saved. Every time you restart app, it's recreated
> 
> This is intended behaviour, I don't see a reason to keep it saved
> 

### Editing

In case you want to edit project

1. Clone repository
2. Copy `.server.env` file to `back` folder as `.env`
3. Run `npm install` on both `back` and `front`
4. Use `npm run` commands, check `package.json` for them, they're pretty straightforward

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Used libraries

### Frontend
- **Webpack** — bundler
  - **Babel** — JavaScript transcompiler
  - **PostCSS** — for CSS plugins
  - **MiniCSS** — cuts CSS into small files
  - **cross-env** — compatability for env on different OS
  - **react-reload** — hot reload for React
- **React** — main framework
- **TypeScript** — typed JavaScript
- **Sass** — CSS preprocessor
- **Jest** — testing library
- **ESLint** — JavaScript linter
- **validator** — small validating library
- **Socket.IO** — WebSockets library

### Backend
- **Express** — main framework
  - **body-parser** — to parse JSON bodies
  - **cors** — to configure CORS
  - **dotenv** — to use .env file variables
  - **cookie-parser** — to parse cookies
  - **multer** — to parse forms and files
  - **nodemon** — hot reload
  - **concurrently** — run commands concurrently
- **JSONWebToken** — to parse and compose JSON web tokens
- **bcrypt** — to encrypt passwords
- **sequelize** — ORM, project uses SQLite
- **sequelize-typescript** — better TypeScript support for sequelize
- **Socket.IO** — WebSockets library
- **validator** — small validating library

<p align="right">(<a href="#readme-top">back to top</a>)</p>


