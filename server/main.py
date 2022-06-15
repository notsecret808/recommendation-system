import json
import pickle
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sqlite3
from typing import List
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity;
import surprise;
import operator;

TITLES_LEN = 17770

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Movie(BaseModel):
    id: int
    year: int
    title: str
    rating: int

def generate_np_arr(dict):
  arr = np.zeros(TITLES_LEN, dtype=int)
  for key, value in dict.items():
    arr[int(key)] = int(value)
  return arr

# здесь вычисляю угол между косинусом (cosine similarity)
def calc_max_cos_sim(new_user):
  cos_matrix = {}
  file = open("static/users_ratings.pkl", "rb")
  out = pickle.load(file)
  users_ratings = out
  new_user_np = generate_np_arr(new_user).reshape(1,-1)

  for id, ratings in users_ratings.items():
    cur_arr = generate_np_arr(ratings).reshape(1,-1)
    cos_matrix[id] = cosine_similarity(cur_arr, new_user_np)[0][0]
  return max(cos_matrix.items(), key=operator.itemgetter(1))[0]

@app.get('/get_movies')
async def get_movies():
    conn = sqlite3.connect('db/db.db')
    c = conn.cursor()
    res = c.execute('''SELECT * FROM movies''').fetchall()
    json_res = json.dumps(res)
    return json_res

@app.post('/get_prediction')
async def get_prediction(movies: List[Movie]):
    payload = {}
    for movie in movies:
        payload[int(movie.id)] = movie.rating
    sim_user = calc_max_cos_sim(payload)
    model = surprise.dump.load('static/surprise_model')
    con = sqlite3.connect('db/db.db')
    cur = con.cursor()

    df_title = pd.read_sql("SELECT * FROM movies", con, columns = ['movie_id', 'year', 'name'])
    df_title = df_title.reset_index()
    df_title['estimate_score'] = df_title['movie_id'].apply(lambda x: model[1].predict(sim_user, x).est)
    df_title = df_title.drop('movie_id', axis = 1)
    df_title = df_title.sort_values('estimate_score', ascending = False)
    res = df_title.head(10).to_dict()
    res_arr = []
    for key in res['year'].keys():
        movie = {}
        movie['id'] = key
        movie['year'] = res['year'][key]
        movie['title'] = res['name'][key]
        res_arr.append(movie)
    return res_arr