export type SensorEvent = {
  id: string
  coordinates: string
  status: "registered" | "checkpoint" | "delayed"
}
