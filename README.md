# Midterm

Your mission: create a scatterplot using the automobile data provided in this repo (see `data/data.csv`).

## Instructions

You Must:

- [ ] load the csv data asyncronously using `d3.csv()`
- [ ] parse and format the data in the callback to `d3.csv`
- [ ] choose a variable in the data set for the x scale
- [ ] choose a variable in the data set for the y scale
- [ ] choose a variable in the data set to represent with color
- [ ] draw and label the x axis ("label" meaning the variable you are using)
- [ ] draw and label the y axis ("label" meaning the variable you are using)
- [ ] draw circles for each data point that are positioned using the x and y scales and have a fill color using the color scale
- [ ] after **3 seconds** make the circles and y axis update using a different variable for the y scale and y axis
- [ ] after **6 seconds** make the circles and x axis update using a different variable for the x scale and x axis
- [ ] use `d3.transition()` to animate the updates
- [ ] complete this assignment on your own
- [ ] commit your changes incrementally to this repo and push them to its remote url
- [ ] comment each code block in your own words

### Choosing Data Variables
It's up to you to decide which variables to use for each scale, try some different ones and see what makes sense. They are:

- mpg
- cylinders
- displacement
- horsepower
- weight
- acceleration
- year
- origin
- name

You must determine what types of scales to use for the variables you choose. Looking back to code from previous classes should help you with this, as should the documentation in `d3-scale`.

The d3 documentation and MDN are your friends here. Try to break down the tasks above into individual problems before piecing them together, rather then doing everything at once.

## Advice
Do your best, try not to get frustrated and give up. If you are unable to get something working try taking a break and coming back to it later.

To debug your code use Chrome's Dev Tools: try using `console.log`'s, breakpoints, and commenting things out.

It's a good idea to not wait until the day before this is due and attempt to finish it in one go.
