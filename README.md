# **Click 'n Meal**

[Click here to see deployed app](https://click-n-meal.herokuapp.com/)

## **Description**
Select your favorite recipes, get the list of associated ingredients and create a complete groceries list

## **MVP**
- Login/logout
  - public and private permission
- Signup
- Choosing recipies with different filters (prepare time, cost, vegan, rating)
- Creating list of ingredients based on chosen recipes
- Remove ingredients which are already in house
- Calendar with overview recipes of all the recipes for everyday
- Edit recipe
- Create new recipe
- Private view with favorite recipies

## **Backlog**
- Supermarket ordering (eg vegetables, diary, canfood)
- Give in the ingredients in you house and get the best matchingrecipes available
- Random recipe generator/suggestion
- Vegan or Vegetarian ingredients as alternative (1 recipe but 3 different types (vegan, vegetarian, meat)
- Api (food, images)
- FoodFacts (api?)
- Printable view of the week-overview
- Extra Admin account for premission editing and creating all recipes

## **Routes**


### /
### /selector
### /search
### /recipe
### /ingredients
### /calendar
### /signup
### /signin
### /profile-page
### /create
### /edit
### /about
### /error

## **Model structure**
- Users: contains all the users that are signedup, including their role (user/admin)
  - name
  - email
  - password
  - favo recipe - [idrecipe 1, idrecipe 2, ..]
  - role - [user, admin]
  
- Recipes
  - name
  - description - one liner about recipe
  - image -
  - instructions
  - time - how many minutes the recipe takes
  - price - category
  - ingredients - ref to Model Ingredients
  - rating
  - source
  - creator
  - weekday- for in the calendar view
  - type: vegan/vegetarian/meat
  - amount
  - unit

- Ingredients
  - ref: to api
  - Name
  - Catagory

### main
- openfoodfact



## **Links**
- [Trello Link](https://trello.com/b/MjmY8cAw/click-n-meal)
- [Presentation Link](https://slides.com/cindytvn/deck)
- [Github repository Link](https://github.com/degroot12/click-n-meal)
- [Deployment Link](https://click-n-meal.herokuapp.com/)


