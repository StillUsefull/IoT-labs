CREATE TABLE processed_agent_data (
    id SERIAL PRIMARY KEY,
    x TEXT NOT NULL,
    y TEXT NOT NULL,
    z TEXT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    road_state TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);