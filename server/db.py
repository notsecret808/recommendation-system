from pathlib import Path
import pandas as pd
import sqlite3
curPath = Path(__file__).parent.resolve()
Path('db/db.db').touch()
conn = sqlite3.connect('db/db.db')
c = conn.cursor()
movies = pd.read_csv(f'{curPath}\dataset\movie_titles.csv', encoding = 'ISO-8859-1', names=['movie_id', 'year', 'name'], error_bad_lines='skip', delimiter = ',')
movies.to_sql('movies', conn, index=False)




