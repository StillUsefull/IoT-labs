CREATE TABLE processed_agent_data (
    id SERIAL PRIMARY KEY,
    road_state VARCHAR(255) NOT NULL,
    x TEXT NOT NULL,
    y TEXT NOT NULL,
    z TEXT NOT NULL,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);