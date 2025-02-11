from src import image_maker

input_text = input("Enter yout text: ")
input_color = input("Enter your color: ")
darker_input_color = input("Enter your darker color: ")

maker = image_maker.ImageMaker(input_text, input_color, darker_input_color)
img_buffer = maker.save_image()
print("Image saved as "+input_text+".png in output folder")