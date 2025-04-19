import os
from flask import Flask, jsonify
from sqlalchemy import create_engine, text, inspect

app = Flask(__name__)

# Get the database URL
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise RuntimeError("DATABASE_URL environment variable not set")
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

# Create SQLAlchemy engine (no ORM)
engine = create_engine(database_url)


@app.route('/manufacturers', methods=['GET'])
def get_manufacturers():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM Manufacturer"))
            manufacturers = [dict(row._mapping) for row in result]
        return jsonify({"result": manufacturers})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/users', methods=['GET'])
def get_users():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM User"))
            users = [dict(row._mapping) for row in result]
        return jsonify({"users": users})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/manufacturers/search/<name>', methods=['GET'])
def search_manufacturer(name):
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM Manufacturer WHERE name = :name"), {'name': name})
            row = result.fetchone()
            if row:
                return jsonify(dict(row._mapping))
            else:
                return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/db-check', methods=['GET'])
def db_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 0"))
        return jsonify({"status": "Database connection successful"})
    except Exception as e:
        return jsonify({"error": "Database connection failed", "details": str(e)}), 500


@app.route('/check-tables', methods=['GET'])
def check_tables():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        return jsonify({"tables": tables})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
