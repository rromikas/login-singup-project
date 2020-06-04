# [Demo: https://booksapp.netlify.app](https://booksapp.netlify.app/)

**3 rd iteration**. Books app that allows to add google books to database and search from them. Users can write summaries, open discussions about certain book, reply in discussions, vote on replies, rate summaries. Website is designed to use both on mobile and computer devices.

Communication with backend uses socket connection but it's easy to migrate to https request based communication.

Server repo: [https://github.com/rromikas/saugauserveri](https://github.com/rromikas/saugauserveri)

To run project:

1. git clone repo
2. npm install
3. npm start

Project built on **React js** library. For styling **bootstrap** is used. To change main colors, change themeMain, themeLighterMian, themeMainContrast variables in styles/style.scss file. All request to server are scripted in javascript/requests folder. There is **origin constant** declared too. Change it to your server url to send requests to your server. Change **client id** in social/google.jsx component and **app id** in social/facebook.jsx component to yours. For navigating through routes **history** node package is used. History object is initialized in routing/history.jsx file.

User sign up with facebook or google and login with facebook or google do the same - creates user record in mongodb if it hadn't be done yet and logins to the account. Once user registered his email with facebook or google, he cannot login with email form. Although, user can login to the account created by submitting email form with facebook or google. After login, client retrieves jwt token and stores in the browser. It expires after 7 days, so it would be good to refresh after user enter his account. For demonstrating purpose it is not implemented.
