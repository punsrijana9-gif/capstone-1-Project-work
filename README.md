# Community Learning Hub

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

1. Keep these files in the same folder:

```text
Community-Learning-Hub/
│
├── index.html
├── styles.css
└── app.js
```

2. Open the project using a local web server.

3. Open `index.html` in the browser through the local server.

4. Wait for the message **"Data loaded successfully."**

5. Use the navigation buttons to explore:
   - Roster
   - Group Board
   - Leader Channel
   - History

## Important

The application needs access to the Google Sheets data.

If the data cannot be loaded, check:

- Internet connection
- Google Sheet access
- Google Sheet names
- CSV URLs in `app.js`

The application shows an error message when the data cannot be loaded.

## Design

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
