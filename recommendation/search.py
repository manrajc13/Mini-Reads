import numpy as np 
import pandas as pd 
from rapidfuzz import process





class SearchBook:

    def __init__(self):
        self.book_df = pd.read_csv('C:\\Users\\Lenovo\\OneDrive\\Desktop\\Mini-Reads3\\macro-reads\\recommendation\\Book_recommender_df.csv')

    def search_by_title(self, query):
        matches = [match[0] for match in process.extract(query, self.book_df['title'], limit = 30)]
        temp_df = self.book_df[self.book_df['title'].isin(matches)].sort_values(by = 'weighted_rating', ascending = False).iloc[:5, :]
        result = []
        for _, row in temp_df.iterrows():
            result.append({
                'title': row['title'],
                'author': row['author']
            })
        return result 

    def expand_book(self, book_title):
        book = self.book_df[self.book_df['title'] == book_title]
        result = {}
        result['title'] = book['title'].iloc[0]
        result['author'] = book['author'].iloc[0]
        result['description'] = book['description'].iloc[0]
        result['genres'] = book['genres'].iloc[0]
        result['rating'] = book['weighted_rating'].iloc[0]
        result['coverImg'] = book['coverImg'].iloc[0]
        return result


    def search_by_author(self, query):
        pass  

    def search_by_genre(self, query):
        pass 