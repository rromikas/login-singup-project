# [Demo: https://booksapp.netlify.app](https://booksapp.netlify.app/)

**3 rd iteration**. Books app that allows to add google books to database and search from them. Users can write summaries, open discussions about certain book, reply in discussions, vote on replies, rate summaries. Website is designed to use both on mobile and computer devices.

Communication with backend uses socket connection but it's easy to migrate to https request based communication.

Server repo: [https://github.com/rromikas/saugauserveri](https://github.com/rromikas/saugauserveri)

What were done:

- Filters panels fixed. There was problem that after cheking an option, it doesn’t get checked. This error was caused by getting uniqe filters options before passing them to component and then setting checked property to the wrong option.

* Instead of three different state objects of filters (genres, authors, publishers) I wrapped them into one object filter whose properties are arrays of filters (genres, authors, publishers). It saves some requests to the server triggered by useEffect hook.

- Summaries MongoDB schema created. In Books schema I added summaries field, where array of book summaries’ id will be stored. In User chema I added summaries field, where array of user written summaries’ id will be stored.

* Summary page is similar to thread page. Summary will have comments that are predefined by “Replies” schema in mongo db.

- Seperate discussion schema created instead of storing discussion in the books schema. Replies to discussion also has been separated in the new schema.

* Replies to a thread in discussion moved right relatively to thread topic. Though on mobile view they both will be on the same level, to keep content readability.

- Opportunity to upvote and downvote replies to a thread or withdraw vote implemented. User can vote only one time on certain reply. He can change his vote and he will see his decision after page reload.

* History based breadcrumbs added.

- User can view his summaries in profile page. Summary panel heights can not be made the same since content height is different on different devices. I give it minimum height 310px and truncate summary description to have 300 symbols. All summaries looks similar height and are fully responsive.

* User can edit his summaries, change text, make private or public.

- Separate Header component created. It contains navigation links, search bar and login / signup buttons. Header is fully responsive on different screens. On mobile device navigation links are accessible through hamburger menu.

* Login / signup pages have link to home page now.

To run project:

1. git clone repo
2. npm install
3. npm start

Project built on **React js** library. For styling **bootstrap** is used. To change main colors, change themeMain, themeLighterMian, themeMainContrast variables in styles/style.scss file. All request to server are scripted in javascript/requests folder. There is **origin constant** declared too. Change it to your server url to send requests to your server. Change **client id** in social/google.jsx component and **app id** in social/facebook.jsx component to yours. For navigating through routes **history** node package is used. History object is initialized in routing/history.jsx file.

User sign up with facebook or google and login with facebook or google do the same - creates user record in mongodb if it hadn't be done yet and logins to the account. Once user registered his email with facebook or google, he cannot login with email form. Although, user can login to the account created by submitting email form with facebook or google. After login, client retrieves jwt token and stores in the browser. It expires after 7 days, so it would be good to refresh after user enter his account. For demonstrating purpose it is not implemented.
