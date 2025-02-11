from PIL import Image, ImageDraw
import colorsys
import io

chars = {
    "a": "./font/a.png", "b": "./font/b.png", "c": "./font/c.png",
    "d": "./font/d.png", "e": "./font/e.png", "f": "./font/f.png",
    "g": "./font/g.png", "h": "./font/h.png", "i": "./font/i.png",
    "ı": "./font/ı.png", "j": "./font/j.png", "k": "./font/k.png",
    "l": "./font/l.png", "m": "./font/m.png", "n": "./font/n.png", 
    "o": "./font/o.png","p": "./font/p.png", "r": "./font/r.png", 
    "s": "./font/s.png","t": "./font/t.png", "u": "./font/u.png", 
    "v": "./font/v.png","y": "./font/y.png", "z": "./font/z.png", 
    "q": "./font/q.png","w": "./font/w.png", "x": "./font/x.png", 
    "0": "./font/0.png","1": "./font/1.png", "2": "./font/2.png", 
    "3": "./font/3.png","4": "./font/4.png", "5": "./font/5.png", 
    "6": "./font/6.png","7": "./font/7.png", "8": "./font/8.png",
    "9": "./font/9.png", "ı": "./font/dotless_i.png", "ğ": "./font/g_with_cap.png",
    "ç": "./font/c_with_dot.png", "ş": "./font/s_with_dot.png", "ö": "./font/o_with_dot.png",
    "ü": "./font/u_with_dot.png", "+": "./font/plus.png", "\"": "./font/plus.png"
}

class ImageMaker:
    @staticmethod
    def get_darker_color(hex_color):
        r, g, b = [int(hex_color[i:i+2], 16) for i in (1, 3, 5)]
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        v *= 0.7
        r, g, b = [round(c * 255) for c in colorsys.hsv_to_rgb(h, s, v)]
        return f"#{r:02x}{g:02x}{b:02x}"

    def __init__(self, input_text, input_color, darker_input_color):
        self.input_text = input_text.lower()
        self.input_color = input_color
        self.darker_input_color = self.get_darker_color(input_color) if darker_input_color == "0" else darker_input_color
        self.image = self.create_image()
        self.write_text_shadow()
        self.write_text()

    def save_image(self):
        self.image.save("output/"+self.input_text+".png")

    def find_char_width(self, char):
        return 3 if char == " " else Image.open(chars[char]).width

    def find_image_width(self):
        return 4 + sum(self.find_char_width(char) + 1 for char in self.input_text) - 1

    def create_image(self):
        width = self.find_image_width()
        image = Image.new("RGB", (width, 9), self.darker_input_color)
        draw = ImageDraw.Draw(image)
        draw.rectangle((1, 1, width - 2, 7), fill=self.input_color)
        return image

    def paste_char_shadow(self, char, offset):
        if char == " ":
            return
        img = self.change_nontransparent_pixels_color(chars[char], self.darker_input_color)
        self.image.paste(img, offset, img)
        return

    def paste_char(self, char, offset):
        if char == " ":
            return
        img = Image.open(chars[char])
        self.image.paste(img, offset, img)

    def write_text_shadow(self):
        offsetX = 3
        textChars = list(self.input_text)
        for char in textChars:
            self.paste_char_shadow(char, (offsetX, 0))
            offsetX += 1 + self.find_char_width(char)

    def write_text(self):
        offset_x = 2
        for char in self.input_text:
            self.paste_char(char, (offset_x, 0))  # Normal rengini, kaydırılmadan yazdırıyoruz
            offset_x += self.find_char_width(char) + 1

    def get_image_buffer(self):
        img_buffer = io.BytesIO()
        self.image.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        return img_buffer
    
    def change_nontransparent_pixels_color(self, image_path, new_color):
        image = Image.open(image_path)

        width, height = image.size

        draw = ImageDraw.Draw(image)

        for x in range(width):
            for y in range(height):
                if image.getpixel((x, y))[3] != 0:
                    draw.point((x, y), fill=new_color)

        return image