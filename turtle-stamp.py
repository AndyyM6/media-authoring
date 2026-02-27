import _tkinter as tk
from _tkinter import ttk

import turtle
from turtle import Screen, Turtle

pixel_size = 20
cursor_size = 10
'''define size per pixel in finished image'''

colors = {
    'b': '#1B1E23',
    'w': '#FFFDD0',
    'g': '#808080',
    'e': '#301934',
    }
'''define colors with corresponding letters to arrange
    b = off-black
    w = off-white / cream
    g = grey
    e = dark purple'''    

pixels = [
    "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "eeeeeeeeeeeeeeebbbbbbbbeeeeeeeeeeeeee",
    "eeeeeeeeeeebbbbwwwwwwwwbbbbeeeeeeeeee",
    "eeeeeeeeebbbwwwwwwwwwwwwwwwbbeeeeeeee",
    "eeeeeeeebbwwwwwwwwwwwwwwwwwwwbeeeeeee",
    "eeeeeeebbwwwwwwwwwwwwwwwwwwwwbbeeeeee",
    "eeeeeebbwwwwwwwwwwwwwwwwwwwwwwbbeeeee",
    "eeeeeebwwwwwwwwwwwwwwwwwwwwwwwbbeeeee",
    "eeeeebwwwwwwwwwwwwwwwwwwwwwwwwwbbeeee",
    "eeeeebwwwwwwwwwwwwwwwwwwwwwwwwwbbeeee",
    "eeeebwwwwwwwwwwwwwwwwwwwwwwwwwwbbbeee",
    "eeeebwwwwwwwwwwwwwwwwwwwwwwwwwbbbbeee",
    "eeeeebbbbwwwwwwbwwwwwwbwwwwwwbbbbbeee",
    "eeeebwwwwbwwwwbwwwwwbbbbwwwwwbbbbbeee",
    "eeebwwwwwwwwwwwwwwwwwwwbbwwwwbbbbbbee",
    "eeebwbbbwwwwwwwwbbbbwwwwbwbwwbbbbbbee",
    "eebwbbbbbwbwwwwbbbbbbwwbbwbwwbbbbbbee",
    "ebwbbbbbbwbwwwbbbbbbbbwwbbwwwbbbbbbee",
    "ebwbbbbbbwbwwwbbbbbbbbwwbwbwbbwwbbbee",
    "ebwbbbbbbwbwwwbbbbbbbbwwbwbwbwwbbbeee",
    "ebwbbbbbbbwwwwbbbbbbbbwwbwbbwwbbbeeee",
    "eebwbbbbbwbwwwwbbbbbbbbwwbwwwbbbbeeee",
    "ebwbbbbbwbbwwwbbbbbbbbwwbwbbbbbbeeeee",
    "ebwbbbbbwbbwwwwbbbbbbbwwbwbbbbbeeeeee",
    "ebwbbbbwbbbbwwwwbbbbbbbwbwbbbbbeeeeee",
    "ebwwbbwwbbbbwwwwwbbbbbbwbwbbbbbeeeeee",
    "ebwwbwwbbbbbbwbwwwbbbbwwbwbbbbeeeeeee",
    "eebbwwwbbwbbbwwbwwwwwwwwbwbbbeeeeeeee",
    "eeebwwwwbwbbwwwwbwwwwbbbbwbbbeeeeeeee",
    "eebwwwwwwwwwwwwwwbbbwwbbwbbbeeeeeeeee",
    "eebwbwbwbwbwbwbwwbbbbbbbbbeeeeeeeeeee",
    "eeebwbwbwbwbwbwbbbbeeeeeeeeeeeeeeeeee",
    "eeebwbwbwbwbwbwbbeeeeeeeeeeeeeeeeeeee",
    "eeebwbwbwbwbwbwbeeeeeeeeeeeeeeeeeeeee",
    "eeeebwbwbwbwbwbeeeeeeeeeeeeeeeeeeeeee",
    "eeeeebebebebebeeeeeeeeeeeeeeeeeeeeeee",
    "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    ]
'''Full arrangement map of a skull using the assigned color letters in strings'''

width, height = len(pixels[0]), len(pixels)

def screen_func(screen):
    screen = Screen()
    screen.setup((width + 3) * pixel_size, (height + 3) * pixel_size)
    return screen
'''Function setting up the screen to follow the dimensions of what has been mapped and the size of each stamp'''

def turt_func(turtle):
    turtle = Turtle()
    turtle.hideturtle()
    turtle.shape('square')
    turtle.shapesize(pixel_size / cursor_size)
    turtle.penup()
    return turtle
'''Defining the shape of the stamp in each line of the arrangement'''

x0 = -width/2 * pixel_size
y0 = height/2 * pixel_size

def stamp_skull(turtle):
    for i, row in enumerate(pixels):
        turtle = turt_func(turtle)
        turtle.setposition(x0, y0 - i * pixel_size)

        for pixel in row:
            turtle.color(colors[pixel])
            turtle.stamp()
            turtle.forward(pixel_size)
'''Function defining the stamp that is used when following the arrangement map'''

def screen_end(screen):
    screen = Screen()
    screen.exitonclick()
    return screen
'''Keep window open after generating image'''

def main():
    jules = turtle.Turtle()
    screen_func(jules)
    vincent = turtle.Turtle()
    turt_func(vincent)
    marsellus = turtle.Turtle()
    stamp_skull(marsellus)
    marvin = turtle.Turtle()
    screen_end(marvin)

if __name__ == '__main__':
    main()