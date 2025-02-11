from flask import Flask, request, send_file
from src import image_maker

app = Flask(__name__)

@app.route("/generate-image")
def generate_image():
    text = request.args.get("text", "kıtamor")
    color = request.args.get("color", "#ffaaff")
    darker_color = request.args.get("darker_color", "#ff55ff")

    try:
        maker = image_maker.ImageMaker(text, color, darker_color)
    except Exception as e:
        maker = image_maker.ImageMaker("error check console", "#ff5555", "#aa1111")
        print(e)

    img_buffer = maker.get_image_buffer()
    return send_file(img_buffer, mimetype="image/png")


if __name__ == "__main__":
    app.run(debug=True)