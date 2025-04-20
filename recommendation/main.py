from flask import Flask, request, jsonify
from flask_cors import CORS
from model import BookRecommendation
from search import SearchBook

app = Flask(__name__)

CORS(app)

book_recommender = BookRecommendation()
search_book = SearchBook()


@app.route('/search_books', methods = ["POST","GET"])
def search_books():
    if request.method == 'POST':
        data = request.get_json()
        search_query = data['query']
        criteria = data.get('criteria', 'title')  # Default to 'title' if not provided
        if (criteria == 'title'):
            result = search_book.search_by_title(search_query)
        elif (criteria == 'author'):
            result = search_book.search_by_author(search_query)
        else:
            result = search_book.search_by_genre(search_query)
        return jsonify({'search_results': result})
    else:
        return jsonify({"message":"Please use a POST method"})
    

@app.route('/get_book_info', methods = ['POST','GET'])
def get_book_info():
    if request.method == 'POST':
        data = request.get_json()
        book_title = data['title']
        book_info = search_book.expand_book(book_title)
        return jsonify({'book_info': book_info})
    
    else:
        return jsonify({"message":"Please use a POST method"})
    

@app.route('/generalized_recommendations', methods = ['POST','GET'])
def generalized_recommendations():
    if request.method == 'POST':
        data = request.get_json()
        genres = data.get('genres')
        result = search_book.general_recommendations(genres)
        return jsonify({'recommendations': result})
    else:
        return jsonify({'message': 'Please use POST method'})
    

@app.route('/recommend_books', methods = ['POST','GET'])
def home():
    if request.method == 'POST':
        data = request.get_json()
        books = data.get('query')
        recommendations = book_recommender.get_recommendations(books)
        return jsonify({'recommendations': recommendations})
    else:
        return jsonify({'message': 'Please use POST method'})

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
