import pandas as pd
import os
from flask import jsonify, Flask
from prophet import Prophet
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = Flask(__name__)


def load_sales():
    file_path = 'sales_data.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} does not exist")
        return pd.DataFrame(columns=['ds', 'y', 'product_id'])

    try:
        df = pd.read_csv(file_path, parse_dates=['date'])
        if df.empty:
            print(f"Warning: {file_path} is empty")
            return pd.DataFrame(columns=['ds', 'y', 'product_id'])

        # Check required columns
        required_cols = ['date', 'sales', 'product_id']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"Error: Missing columns in {file_path}: {missing_cols}")
            return pd.DataFrame(columns=['ds', 'y', 'product_id'])

        print(f"Successfully loaded {len(df)} rows from {file_path}")
        return df.rename(columns={'date': 'ds', 'sales': 'y'})
    except Exception as e:
        print(f"Error loading sales data: {e}")
        return pd.DataFrame(columns=['ds', 'y', 'product_id'])


def forecast_sales(horizon_days=30):
    sales = load_sales()
    if sales.empty:
        print("No sales data available for forecasting")
        return pd.DataFrame()

    print(
        f"Forecasting for {len(sales['product_id'].unique())} unique products")
    forecasts = []
    for pid, grp in sales.groupby('product_id'):
        try:
            print(
                f"Fitting Prophet model for product_id: {pid} with {len(grp)} data points")
            m = Prophet(yearly_seasonality=True,
                        weekly_seasonality=True, daily_seasonality=False)
            m.fit(grp[['ds', 'y']])
            future = m.make_future_dataframe(periods=horizon_days)
            fc = m.predict(future)[['ds', 'yhat']].tail(horizon_days)
            fc['product_id'] = pid
            forecasts.append(fc)
        except Exception as e:
            print(f"Error forecasting for product_id {pid}: {e}")

    if not forecasts:
        print("No forecasts were generated")
        return pd.DataFrame()

    result = pd.concat(forecasts, ignore_index=True)
    print(f"Generated forecast with {len(result)} rows")
    return result


def compute_restock():
    inv_path = 'inventory_data.csv'
    if not os.path.exists(inv_path):
        print(f"Error: {inv_path} does not exist")
        return pd.DataFrame()

    try:
        inv = pd.read_csv(inv_path)
        print(f"Loaded inventory data with {len(inv)} rows")

        # Check required columns
        required_cols = ['product_id', 'current_stock', 'safety_stock']
        missing_cols = [col for col in required_cols if col not in inv.columns]
        if missing_cols:
            print(f"Error: Missing columns in {inv_path}: {missing_cols}")
            return pd.DataFrame()

        fc = forecast_sales()
        if fc.empty:
            print("No forecast data available for restock calculation")
            return pd.DataFrame()

        fc_sum = fc.groupby('product_id')['yhat'].sum().reset_index()
        fc_sum = fc_sum.rename(columns={'yhat': 'forecasted_demand_30d'})

        df = fc_sum.merge(inv, on='product_id', how='left')
        print(f"Merged data has {len(df)} rows")

        df['suggested_restock'] = (
            df['forecasted_demand_30d'] -
            (df['current_stock'] - df['safety_stock'])
        ).clip(lower=0).astype(int)

        return df
    except Exception as e:
        print(f"Error computing restock data: {e}")
        return pd.DataFrame()


@app.route('/')
def index():
    print("Processing request to /")

    plot_img = make_forecast_plot()
    if plot_img:
        print("Successfully generated forecast plot")
    else:
        print("Failed to generate forecast plot")

    restock_df = compute_restock()
    if not restock_df.empty:
        print(f"Generated restock data with {len(restock_df)} rows")
        restock_data = restock_df.to_dict(orient='records')
    else:
        print("No restock data generated")
        restock_data = []

    return jsonify({
        'forecast_plot': plot_img,
        'restock_data': restock_data
    })


def make_forecast_plot():
    fc = forecast_sales()
    if fc.empty:
        print("No forecast data available for plotting")
        return None

    try:
        sns.set(style="whitegrid")
        plt.figure(figsize=(8, 5))
        ax = sns.lineplot(data=fc, x='ds', y='yhat',
                          hue='product_id', palette='tab10')
        ax.set_title("30-Day Sales Forecast Per Product")
        ax.set_xlabel("Date")
        ax.set_ylabel("Predicted Sales")
        plt.xticks(rotation=45)
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        img_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        plt.close()
        print("Successfully created forecast plot")
        return img_b64
    except Exception as e:
        print(f"Error creating forecast plot: {e}")
        return None


if __name__ == '__main__':
    app.run(debug=True)
