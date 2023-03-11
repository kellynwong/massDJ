## Intro to massDJ app
Problem: Whenever I dine out with my family and friends, the songs being played over the speakers are either repetitive or not what we want. I noted it was not just a one-off feeling we had - it was recurring. Each time (especially after a couple of drinks over dinner), the whole bunch of us will be like... IF ONLY the restaurant can play THAT SONG! - Just so the few adulting us can reminisce about the good old clubbing days (well of course while sitted properly in our dining chairs having our desserts).

Solution: This app will ideally allow a dine in customer to scan a QR code, and he/she will be brought to the homepage of massDJ. The homepage will list out songs which will allow a customer to upvote or downvote for. The song with the most votes will be played next automatically over the restaurant's speakers. 

## Technologies used
Mongo, Express, React and Node (MERN)
Tailwind for CSS styling

## Wireframe
![Wireframe - User](https://github.com/kellynwong/massDJ/blob/main/frontend/src/assets/User.png)
![Wireframe - Admin](https://github.com/kellynwong/massDJ/blob/main/frontend/src/assets/Restaurant.png)

## User stories
There will be 3 sets of users for the app:
1. Unregistered users: This allows for everyone to take part (i.e vote for a song) the moment they step into the restaurant, without having to sign up for an account. Each user is entitled to 1 vote per song.
2. Registered users: Apart from being able to vote for a song, registered users will be able to access an account history tab, which displays the dates and the songs the user had previously voted for. Similarly, each registered user is entitled to 1 vote per song.
3. Restaurant admin: This allows for an admin to promote, demote or delete an admin/user. Admin will also be able to skip to next song, or play a song immediately regardless of vote count.

## Endpoints
Refer to [back end repo](https://github.com/kellynwong/massDJ/blob/main/server/server.js) for endpoints used in creating this app.

## Future work
1. Allow app to be responsive in mobile, tablets and browsers.
2. Allow admin to upload a new / updated playlist easily via front end (currently admin has to visit "/api/populate" endpoint to do this).
3. Allow users to be able to purchase an "express pass" via front end so their choice of song will be the next to play (regardless of vote count).
4. Expand on account history details to include more meaningful details such as restaurant visited, accompanying guests etc.
