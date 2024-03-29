export type SensorEvent = {
  id: string;
  publicKey: string;
  name: string;
  type: string;
  lastEvent: {
    lat: number;
    lng: number;
    status: string;
  };
};

export type SensorEventDashboard = {
  id: string;
  coordinates: string;
  status: string;
};
