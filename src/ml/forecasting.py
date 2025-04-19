import pandas as pd
from flask import jsonify, render_template, Flask
from prophet import Prophet
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = Flask(__name__)


def load_sales():
    try:
        df = pd.read_csv('sales_data.csv', parse_dates=['date'])
        return df.rename(columns={'date': 'ds', 'sales': 'y'})
    except Exception as e:
        print(f"Error loading sales data: {e}")
        return pd.DataFrame(columns=['ds', 'y', 'product_id'])


def forecast_sales(horizon_days=30):
    sales = load_sales()
    if sales.empty:
        return pd.DataFrame()

    forecasts = []
    for pid, grp in sales.groupby('product_id'):
        m = Prophet(yearly_seasonality=True,
                    weekly_seasonality=True, daily_seasonality=False)
        m.fit(grp[['ds', 'y']])
        future = m.make_future_dataframe(periods=horizon_days)
        fc = m.predict(future)[['ds', 'yhat']].tail(horizon_days)
        fc['product_id'] = pid
        forecasts.append(fc)
    return pd.concat(forecasts, ignore_index=True)


def make_forecast_plot():
    fc = forecast_sales()
    if fc.empty:
        return None

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
    return img_b64


def compute_restock():
    try:
        inv = pd.read_csv('inventory_data.csv')
        fc = forecast_sales().groupby('product_id')['yhat'].sum().reset_index()
        fc = fc.rename(columns={'yhat': 'forecasted_demand_30d'})
        df = fc.merge(inv, on='product_id', how='left')
        df['suggested_restock'] = (
            df['forecasted_demand_30d']
            - (df['current_stock'] - df['safety_stock'])
        ).clip(lower=0).astype(int)
        return df
    except Exception as e:
        print(f"Error computing restock data: {e}")
        return pd.DataFrame()


@app.route('/')
def index():
    plot_img = make_forecast_plot()
    restock_df = compute_restock()
    restock_data = restock_df.to_dict(orient='records')
    return jsonify({
        'forecast_plot': plot_img,
        'restock_data': restock_data
    })


if __name__ == '__main__':
    app.run(debug=True)
