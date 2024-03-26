import { Badge } from "@/components/ui/badge"
import EventsTable from "@/components/eventsTable"
import { useLoaderData } from "react-router-dom"

export async function loader({ params }: { params: any }) {
  return {
    device: {
      id: params.id,  
      name: "Sensor 1",
      coordinates: "41.40338, 2.17403",
      publicKey: "abc",
      imageUrl: "https://via.placeholder.com/300",
      status: "active",
      createdAt: "2021-08-01T00:00:00Z",
      events: [
        {
          id: "m5gr84i9",
          coordinates: "41.40338, 2.17403",
          status: "checkpoint",
        },
        {
          id: "3u1reuv4",
          coordinates: "41.40338, 2.17403",
          status: "checkpoint",
        },
        {
          id: "derv1ws0",
          coordinates: "41.40338, 2.17403",
          status: "checkpoint",
        },
        {
          id: "5kma53ae",
          coordinates: "41.40338, 2.17403",
          status: "checkpoint",
        },
        {
          id: "bhqecj4p",
          coordinates: "41.40338, 2.17403",
          status: "checkpoint",
        },
      ]
    },
  }
}
export default function Device() {
  const { device }: any = useLoaderData()

  return (
    <div className="p-8">
      <div className="flex flex justify-center items-center p-8">
        { device.imageUrl ? <img src={device.imageUrl} alt={device.name} /> : null }
        <div className="p-4 flex flex-col justify-between h-full">
          <h2 className="text-3xl font-bold">{device.name}</h2>
          <p className="text-lg font-thin">ID: {device.id}</p>
          <div className="flex gap-2">
            <Badge variant={device.status === 'active' ? 'default' : 'destructive'}>{device.status}</Badge>
            <Badge variant="secondary">tracked</Badge>
            <Badge variant="outline">scanned</Badge>
          </div>
          <ul className="mt-5">
            <li>public key: {device.publicKey}</li>
            <li>coordinates: {device.coordinates}</li>
            <li>created at: {device.createdAt}</li>
          </ul>
        </div>
      </div>
      <h2 className="text-2xl font-bold">Events</h2>
      <EventsTable data={device.events} />
    </div>
  )
}
