## See The World

An app to share travel experiences with exciting photos, tips on traveling to those locations, and sharing stories.

## Getting started immediately

-Go here to see the deployed version. (http://www.heroku.com/seetheworld/etc)

### Prerequisites

This project is a RESTFul express app, all that is needed is npm. All the packages will be installed for you with the below command

### Installing

```
npm i
```

## How to use this app

* Register to get access to the site
* Once registered, you have the option to add a filter to your profile photo
* After registration, you can see all of the articles, simply click one to see the full article, and leave a comment or a like!
* You can also add your own articles, and afterward, add some simple filters
* You also have access to editing your profile, and editing your articles
* Please note: If you create an article, and delete your account, that article will stay live for everyone to enjoy, unless you delete it. Future plans will add a delete all button

![alt text](https://i.imgur.com/ODHDQih.png?1)

## Wireframes

![alt text](https://i.imgur.com/tI5ear6.jpg?4)

![alt text](https://i.imgur.com/KLAhrjj.jpg?1)

![alt text](https://i.imgur.com/jU3KFhM.jpg?2)

## Models
-- User
```
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: String,
	city: {
		type: String,
		required: true
	},
	articles: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article',
		required: true
	},
	favoritePlace: {
		type: String,
		required: true
	},
	about: String,
	image: {
		data: Buffer,
		contentType: String
	}
	})
```
-- Article
```
const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	image: {
		data: Buffer,
		required: true
	},
	description: String,
	tips: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	comments: [Comment.schema],
	likes: Number
	})
```

-- Comment
```
const commentSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
		},
	date: {
		type: Date,
		default: Date.now
	}
	})
```


## User Stories

The user first must register or log in.

If they pick register, it will bring them to the registration page.
Here they can fill out their information such as username, password, first name, last name, city, favorite place, about and profile picture.

Once they hit submit, it will take them to the filter page where they can choose a filter for their photo. or they can choose to pass.

After they submit the filter, they will be on the home page. Where they can see all of the resent article submissions.
Here they can see the articles submited, and how many likes they each have.


On that page, they have a my account link in the nav, which will take them to their profile page, my articles link to take them to all their articles, they have a create link which will take them to the article creation page, and a logout link, which will log them out. Also, the logo will be a link to have them go back to home.


If the pic to add an article, they will be taken to the add article form. here they can add the required form options, choose a location that photo was from, and upload a photo. After they submit, it will take them to the filter page, where they can add a filter to the photo, they can click different buttons for different filter effects. after this, they will be redirected to the new article show page they recently submitted.

Here if they are logged in as the user, they can edit the article, or delete it. A nice to have will be to delete the comments that they need to moderate.


If they want to, they can go to the my artciles, which will show them all of their created articles. Nice to have would be Here they can delete or edit them straight from this page.


Another option for the user would be to click the all users link, which will show them a list of users and the city them are from, if they click one, it'll take them to that users my-articles page, to see all of their articles .


When the user is on someone elses article page, they can leave a comment and a like. Whenever they are on a show article page, a small map will show up, showing where that photo was taken. 


If the user leaves and comes back to log in, after login, it will take them straight to the article index page. seeing all the most recent activity.

### Nice to have

Notifications when user recieves new comments or likes on photos. can click notification to get to it.



## Built With

* [GoogleMaps](https://developers.google.com/maps/documentation/embed/guide?hl=en_US#place_mode) - An Api for Maps!
* [Cloudinary](https://cloudinary.com/blog/cloud_based_api_for_applying_effects_on_images) - An Api for Image Filters


## Authors
[Nehemias Alcantara](https://github.com/nemiasalc56) |
[Branden LaCour](https://github.com/BrandenLaCour)


