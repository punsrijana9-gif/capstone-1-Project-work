# Community Learning Hub

**Live site:** PASTE YOUR GITHUB PAGES LINK HERE

## About the Project

Community Learning Hub is a simple web application for viewing community learning information.

It allows users to:

- View group members
- View group leaders
- Read group posts
- Read leader posts
- View a person's history
- Select different groups, leaders, and people

## Main Features

### 1. Roster

Shows the selected group's:

- Group name
- Group period
- Group ID
- Leader
- Members

### 2. Group Board

Shows posts that belong to the selected group.

Posts are displayed with:

- Author name
- Date
- Post text
- Attachment information, if available

### 3. Leader Channel

Shows posts made in a selected leader's channel.

### 4. History

Shows information about a selected person, including:

- Groups they have been part of
- Leaders connected to those groups
- Links to leader channels

## Project Files

The project has three main files:

### `index.html`

This is the main webpage. It contains the header, navigation buttons, data selection area, content area, and footer.

### `styles.css`

This file controls the design of the website. It includes the header, navigation buttons, cards, member lists, posts, history section, footer, and mobile design.

### `app.js`

This file controls the main functionality of the application.

It:

- Loads data from Google Sheets
- Reads CSV data
- Finds people and groups
- Creates navigation
- Displays group members
- Displays posts
- Displays leader channels
- Displays history
- Handles user selections
- Shows loading and error messages

## Data Sources

The application uses four Google Sheets:

- **People** – information about people and leaders
- **Groups** – information about groups
- **Memberships** – connects people with groups
- **Posts** – contains group and leader posts

The JavaScript loads all four data sources when the application starts.

## How to Run

You do not need a local server.

1. Open the live link above, **or** download the four files and open `index.html` in a browser.
2. The page needs an internet connection to load the Google Sheets.
3. Wait for **"Data loaded successfully."**, then use the navigation buttons.

## Using Another Sheet

The four sheet links are the four constants at the top of `app.js`:
`PEOPLE_CSV_URL`, `GROUPS_CSV_URL`, `MEMBERSHIPS_CSV_URL`, `POSTS_CSV_URL`.

To use another sheet:

1. Give it the same four tab names and the same column names.
2. Set sharing to "Anyone with the link - Viewer".
3. Replace the sheet ID (the long code after `/d/`) in all four links.

## Important

The application needs access to the Google Sheets data.

If the data cannot be loaded, check:

- Internet connection
- Google Sheet access
- Google Sheet names
- CSV URLs in `app.js`

The application shows an error message when the data cannot be loaded.

## Visual Design

The website uses a simple, clean design with:

- Blue header
- Navigation buttons
- White content cards
- Responsive mobile layout
- Facebook-style colors and buttons

The CSS also includes a mobile layout for smaller screens.

## Technologies Used

- HTML
- CSS
- JavaScript
- Google Sheets
- CSV data

## Project Goal

The goal of this project is to provide a simple Community Learning Hub where users can easily view groups, members, leaders, posts, and people's learning history.

## Design note

#### Load - Store - Show

The JavaScript first loads the data from four Google Sheets. The four sheets are People, Groups, Memberships, and Posts. The `loadTab()` function gets the sheet data as CSV, and `parseCSV()` changes the CSV data into JavaScript objects.

After loading the data, the objects are stored in four arrays:

- `people`
- `groups`
- `memberships`
- `posts`

The application then uses these arrays to show the correct information on the page. This keeps the data separate from the HTML and makes it easier to update the information.

#### The Four Arrays

The application uses four main arrays:

- **People** stores information about people, such as their ID and name.
- **Groups** stores group information, such as group ID, name, and period.
- **Memberships** connects people with the groups they belong to.
- **Posts** stores posts and connects them to groups or leaders.

The functions such as `findPerson()` and `findGroup()` are used to find the correct person or group from these arrays.

#### How a View is Drawn

The application has four main views:

1. **Roster** - shows the members of the selected group.
2. **Group Board** - shows posts belonging to the selected group.
3. **Leader Channel** - shows posts written by the selected leader.
4. **History** - shows a person's groups and leaders from their membership history.

The navigation buttons change the current view. The functions `updateNavigation()`, `buildPicker()`, and `renderCurrentView()` work together to update the selected view and display the correct information.

For example, when a user clicks a leader's name in History, the application changes to the Leader Channel, selects that leader, and displays the leader's posts.

#### One Decision I Made, and Why

I used small helper functions to keep the JavaScript easier to understand and avoid repeating the same code. For example, `escapeHTML()` helps safely display text, `newestFirst()` sorts posts from newest to oldest, and `postsListHTML()` creates the HTML for a list of posts.

I also used `Promise.all()` when loading the four Google Sheets so the application can load all four data sources together before starting the main page.

For membership data, I used a `Set` to avoid showing the same membership more than once. I also used `localeCompare()` with numeric sorting for group periods so values such as `2023`, `2024`, and `2025` appear in the correct order.

<!-- Live link of Github  -->

https://github.com/punsrijana9-gif/capstone-1-Project-work
