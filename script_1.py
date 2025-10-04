# Train ML models for air quality prediction
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import joblib

# Load the data
df = pd.read_csv('delhi_air_quality_2024.csv')
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Feature engineering for time-based patterns
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['month'] = df['timestamp'].dt.month
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# Create rush hour indicator
df['is_rush_hour'] = df['hour'].isin([7, 8, 9, 17, 18, 19, 20]).astype(int)

# Create winter season indicator (high pollution months)
df['is_winter'] = df['month'].isin([11, 12, 1, 2]).astype(int)

# Create lagged features (previous hour values)
df = df.sort_values('timestamp').reset_index(drop=True)
df['pm2_5_lag1'] = df['pm2_5'].shift(1)
df['pm10_lag1'] = df['pm10'].shift(1)
df['aqi_lag1'] = df['aqi'].shift(1)

# Station encoding
station_dummies = pd.get_dummies(df['station'], prefix='station')
df = pd.concat([df, station_dummies], axis=1)

# Drop rows with NaN values (due to lagging)
df = df.dropna().reset_index(drop=True)

print("Dataset after feature engineering:")
print(f"Shape: {df.shape}")
print(f"Features created: hour, day_of_week, month, is_weekend, is_rush_hour, is_winter, lag features, station dummies")

# Prepare features and targets
feature_columns = ['pm2_5', 'pm10', 'no2', 'so2', 'co', 'o3', 'temperature', 'humidity', 
                  'wind_speed', 'hour', 'day_of_week', 'month', 'is_weekend', 
                  'is_rush_hour', 'is_winter', 'pm2_5_lag1', 'pm10_lag1', 'aqi_lag1'] + list(station_dummies.columns)

X = df[feature_columns]
y_aqi = df['aqi']
y_pm25 = df['pm2_5']

# Split data (80% train, 20% test)
X_train, X_test, y_aqi_train, y_aqi_test = train_test_split(X, y_aqi, test_size=0.2, random_state=42, shuffle=False)
X_train, X_test, y_pm25_train, y_pm25_test = train_test_split(X, y_pm25, test_size=0.2, random_state=42, shuffle=False)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Train multiple models for AQI prediction
models = {
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
    'Linear Regression': LinearRegression()
}

results = {}

for name, model in models.items():
    print(f"\nTraining {name} for AQI prediction...")
    
    # Train the model
    if name == 'Linear Regression':
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        model.fit(X_train_scaled, y_aqi_train)
        y_pred = model.predict(X_test_scaled)
        # Save scaler for linear regression
        joblib.dump(scaler, f'scaler_{name.lower().replace(" ", "_")}.pkl')
    else:
        model.fit(X_train, y_aqi_train)
        y_pred = model.predict(X_test)
    
    # Calculate metrics
    mae = mean_absolute_error(y_aqi_test, y_pred)
    mse = mean_squared_error(y_aqi_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_aqi_test, y_pred)
    
    results[name] = {
        'MAE': mae,
        'RMSE': rmse,
        'R2': r2
    }
    
    print(f"Results for {name}:")
    print(f"  MAE: {mae:.2f}")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  R²: {r2:.3f}")
    
    # Save the model
    joblib.dump(model, f'model_{name.lower().replace(" ", "_")}.pkl')

# Find the best model
best_model_name = min(results.keys(), key=lambda x: results[x]['RMSE'])
best_model = models[best_model_name]

print(f"\n🏆 Best Model: {best_model_name}")
print(f"Best RMSE: {results[best_model_name]['RMSE']:.2f}")
print(f"Best R²: {results[best_model_name]['R2']:.3f}")

# Feature importance for the best model (if it supports it)
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance)

# Create a prediction function
def predict_aqi(pm25, pm10, no2, so2, co, o3, temp, humidity, wind_speed, 
               hour, month, station='Anand Vihar'):
    """
    Predict AQI based on current conditions
    """
    # Create input array
    input_data = np.zeros(len(feature_columns))
    
    # Fill basic features
    input_data[0] = pm25  # pm2_5
    input_data[1] = pm10  # pm10
    input_data[2] = no2   # no2
    input_data[3] = so2   # so2
    input_data[4] = co    # co
    input_data[5] = o3    # o3
    input_data[6] = temp  # temperature
    input_data[7] = humidity  # humidity
    input_data[8] = wind_speed  # wind_speed
    input_data[9] = hour  # hour
    input_data[10] = 0    # day_of_week (default)
    input_data[11] = month  # month
    input_data[12] = 0    # is_weekend (default)
    input_data[13] = 1 if hour in [7, 8, 9, 17, 18, 19, 20] else 0  # is_rush_hour
    input_data[14] = 1 if month in [11, 12, 1, 2] else 0  # is_winter
    input_data[15] = pm25  # pm2_5_lag1 (using current value as approximation)
    input_data[16] = pm10  # pm10_lag1
    input_data[17] = 150   # aqi_lag1 (default estimate)
    
    # Set station dummy (find station column index)
    station_cols = [col for col in feature_columns if col.startswith('station_')]
    for i, col in enumerate(station_cols):
        if station.replace(' ', '.') in col or station in col:
            input_data[18 + i] = 1  # station dummy
            break
    
    # Use the best model for prediction
    if best_model_name == 'Linear Regression':
        scaler = joblib.load('scaler_linear_regression.pkl')
        input_scaled = scaler.transform(input_data.reshape(1, -1))
        prediction = best_model.predict(input_scaled)[0]
    else:
        prediction = best_model.predict(input_data.reshape(1, -1))[0]
    
    return max(0, round(prediction))

# Test the prediction function
sample_prediction = predict_aqi(
    pm25=85, pm10=120, no2=45, so2=15, co=1.2, o3=35,
    temp=28, humidity=65, wind_speed=8, hour=9, month=11
)

print(f"\n🧪 Sample Prediction Test:")
print(f"Input: PM2.5=85, PM10=120, Hour=9, Month=November")
print(f"Predicted AQI: {sample_prediction}")

# Save feature columns for later use
with open('feature_columns.json', 'w') as f:
    json.dump(feature_columns, f)

print("\n✅ Model training completed!")
print(f"✅ Best model saved: model_{best_model_name.lower().replace(' ', '_')}.pkl")
print("✅ Feature columns saved: feature_columns.json")